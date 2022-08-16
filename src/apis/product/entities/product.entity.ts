import { Category } from '../../category/entities/category.entity';
import { Payment } from '../../payment/entities/payment.entity';
import { User } from 'src/apis/user/entities/user.entity';
import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Image } from 'src/apis/image/entities/image.entity';

@Entity()
@ObjectType()
export class Product {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column()
  @Field(() => String)
  name: string;

  @Column()
  @Field(() => String)
  description: string;

  @Column()
  @Field(() => Int)
  cost: number;

  @Column({ nullable: true })
  @Field(() => Date)
  uploadDate: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User)
  @Field(() => User, { nullable: true })
  user: User;

  @DeleteDateColumn()
  @Field(() => Date, { defaultValue: null, nullable: true })
  withDeleted: Date;

  @Column()
  @Field(() => Boolean, { nullable: true, defaultValue: false })
  isSoldOut: boolean;

  @JoinColumn()
  @OneToOne(() => Payment)
  @Field(() => Payment, { nullable: true, defaultValue: null })
  payment: Payment;

  @JoinTable()
  @ManyToMany(() => Category, (categories) => categories.products)
  @Field(() => [Category], { nullable: true })
  categories: Category[];

  @OneToMany(() => Image, (images) => images.product)
  @Field(() => [Image], { nullable: true })
  images: Image[];
}
