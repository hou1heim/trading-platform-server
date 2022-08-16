import {
    BadRequestException,
    ConflictException,
    Injectable,
    UnprocessableEntityException,
  } from '@nestjs/common';
  import { InjectRepository } from '@nestjs/typeorm';
  import { Connection, Repository } from 'typeorm';
  import { IamportService } from '../iamport/iamport.service';
import { Product } from '../product/entities/product.entity';
  import { Payment, PAYMENT_STATUS } from './entities/payment.entity';
  
  @Injectable()
  export class PaymentService {
    constructor(
      @InjectRepository(Payment)
      private readonly paymentRepository: Repository<Payment>,
      @InjectRepository(Product)
      private readonly productRepository: Repository<Product>,
      private readonly iamportService: IamportService,
      private readonly connection: Connection,
    ) {}
  
    async create({ impUid, productId, targetUser }) {
      const access_token = await this.iamportService.getToken();
      const paymentData = await this.iamportService.getPaymentData({
        access_token,
        impUid,
      });
      const productFound = await this.productRepository.findOne({
        where: { id: productId },
      });
      await this.checkAmount({ paymentData, payPrice: productFound.cost });
      await this.checkDuplicate({ impUid });
  
      const queryRunner = await this.connection.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction('SERIALIZABLE');
  
      try {
        const transaction = this.paymentRepository.create({
          impUid,
          status: PAYMENT_STATUS.PAYMENT,
          payPrice: productFound.cost,
          buyer: targetUser,
        });
        await queryRunner.manager.save(transaction);
  
        const productSold = await queryRunner.manager.findOne(
          Product,
          { where: { id: productId },
            lock: { mode: 'pessimistic_write' } },
        );
        const updatedProduct = await this.productRepository.create({
          ...productSold,
          isSoldOut: true,
          payment: transaction,
        });
        await queryRunner.manager.save(updatedProduct);
        await queryRunner.commitTransaction();
        return transaction;
      } catch (error) {
        await queryRunner.rollbackTransaction();
      } finally {
        await queryRunner.release();
      }
    }
  
    async cancel({ impUid, productId, targetUser }) {
      const foundPayment = await this.paymentRepository.find({ where: { impUid } });
      if (foundPayment.length > 1)
        throw new UnprocessableEntityException(
          'ERROR 422: Payment Already Cancelled. Please Check Again.',
        );
      const productFound = await this.productRepository.findOne({
        where: { id: productId },
      });
  
      const access_token = await this.iamportService.getToken();
      await this.iamportService.requestCancel({
        access_token,
        impUid,
        payPrice: productFound.cost,
      });
      const queryRunner = await this.connection.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction('SERIALIZABLE');
  
      try {
        const cancelTransaction = this.paymentRepository.create({
          impUid,
          status: PAYMENT_STATUS.CANCELLATION,
          payPrice: productFound.cost,
          buyer: targetUser,
        });
        await queryRunner.manager.save(cancelTransaction);
  
        const productSold = await queryRunner.manager.findOne(
          Product,
          { where: { id: productId },
            lock: { mode: 'pessimistic_write' } },
        );
        const updatedProduct = await this.productRepository.create({
          ...productSold,
          isSoldOut: false,
          payment: null,
        });
        await queryRunner.manager.save(updatedProduct);
        await queryRunner.commitTransaction();
        return cancelTransaction;
      } catch (error) {
        await queryRunner.rollbackTransaction();
      } finally {
        await queryRunner.release();
      }
    }
  
    async checkAmount({ paymentData, payPrice }) {
      if (paymentData.amount === payPrice) return;
      else
        throw new BadRequestException(
          'ERROR 400: Input Price Does Not Match Payment Data.',
        );
    }
  
    async checkDuplicate({ impUid }) {
      const foundPayment = await this.paymentRepository.findOne({ where: { impUid } });
      if (foundPayment)
        throw new ConflictException(
          'ERROR 409: Payment Transaction Already Complete',
        );
    }
  }
  