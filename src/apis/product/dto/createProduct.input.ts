import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CreateProductInput {
  @Field(() => String)
  name: string;

  @Field(() => String)
  description: string;

  @Field(() => Int)
  cost: number;

  @Field(() => Date, { nullable: true })
  uploadDate: Date;

  @Field(() => String, { nullable: true })
  userId: string;

  @Field(() => [String], { nullable: true })
  categories: string[];

  @Field(() => [String], { nullable: true })
  images: string[];
}
