import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { UserTemp } from './entities/userTemp.entity';
import { UserTempService } from './userTemp.service';

@Resolver()
export class UserTempResolver {
  constructor(private readonly userTempService: UserTempService) {}

  @Mutation(() => UserTemp)
  createUserTemp(@Args('temp') temp: string) {
    return this.userTempService.create({ temp });
  }
}
