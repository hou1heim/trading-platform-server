import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UserInput {
  @Field(() => String)
  userNumber: string;

  @Field(() => String)
  name: string;

  @Field(() => String)
  password: string;

  @Field(() => String, { nullable: true })
  temperatureId: string;

  @Field(() => [String], { nullable: true })
  areasId: string[];
}
