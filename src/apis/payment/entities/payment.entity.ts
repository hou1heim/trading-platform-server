import { User } from '../../user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Field, Int, ObjectType, registerEnumType } from '@nestjs/graphql';

export enum PAYMENT_STATUS {
  PAYMENT = 'PAYMENT',
  CANCELLATION = 'CANCELLATION',
}
registerEnumType(PAYMENT_STATUS, {
  name: 'PAYMENT_STATUS',
});

@Entity()
@ObjectType()
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column()
  @Field(() => String)
  impUid: string;

  @Column()
  @Field(() => PAYMENT_STATUS)
  status: PAYMENT_STATUS;

  @CreateDateColumn()
  @Field(() => Date)
  payDate: Date;

  @Column()
  @Field(() => Int)
  payPrice: number;

  @ManyToOne(() => User)
  @Field(() => User)
  buyer: User;
}