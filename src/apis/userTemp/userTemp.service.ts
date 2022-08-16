import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserTemp } from './entities/userTemp.entity';

@Injectable()
export class UserTempService {
  constructor(
    @InjectRepository(UserTemp)
    private readonly userTempRepository: Repository<UserTemp>,
  ) {}

  async create({ temp }) {
    const result = await this.userTempRepository.save({ temp });
    return result;
  }
}
