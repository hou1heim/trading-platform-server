import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserTemp } from './entities/userTemp.entity';
import { UserTempResolver } from './userTemp.resolver';
import { UserTempService } from './userTemp.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserTemp])],
  providers: [UserTempService, UserTempResolver],
})
export class UserTempModule {}
