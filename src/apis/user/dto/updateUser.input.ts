import { InputType, PartialType } from '@nestjs/graphql'
import { UserInput } from './createUser.input';

@InputType()
export class UpdateUserInput extends PartialType(UserInput){
}
