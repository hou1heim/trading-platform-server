import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';
import { Product } from 'src/apis/product/entities/product.entity';

@Entity()
@ObjectType()
export class Category {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string

  @Column()
  @Field(() => String)
  name: string;

  @ManyToMany(() => Product, (products) => products.categories)
  @Field(() => [Product])
  products: Product[];
}
