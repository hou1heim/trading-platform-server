import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';
import { Product } from 'src/apis/product/entities/product.entity';

@Entity()
@ObjectType()
export class Image {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column()
  @Field(() => String)
  src: string;

  @Column()
  @Field(() => Date)
  uploadedAt: Date;

  @DeleteDateColumn()
  @Field(() => Date, { defaultValue: null, nullable: true })
  withDeleted: Date;

  @JoinTable()
  @ManyToOne(() => Product, (product) => product.images)
  @Field(() => Product)
  product: Product;
}
