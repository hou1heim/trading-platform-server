import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserArea } from '../userArea/entities/userArea.entity';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserArea)
    private readonly areaRepository: Repository<UserArea>,
  ) {}

  async create({ userInput }) {
    const { areasId, temperatureId, userNumber, password, ...userInfo } =
      userInput;
    const userFound = await this.userRepository.findOne({
      where: { userNumber },
    });
    if (userFound) throw new ConflictException('이미 등록된 사용자입니다.');
    const hashedPassword = await bcrypt.hash(password, 12);
    const resultAreas = [];
    if (areasId) {
      for (let i = 0; i < areasId.length; i++) {
        const newArea = await this.areaRepository.save({ name: areasId[i] });
        resultAreas.push(newArea);
      }
    }

    const newUser = await this.userRepository.save({
      ...userInfo,
      password: hashedPassword,
      userNumber: userNumber,
      temperature: temperatureId,
      areas: resultAreas,
    });
    return newUser;
  }

  async delete({ userId }) {
    const result = await this.userRepository.softDelete({ id: userId });
    return result.affected ? true : false;
  }

  async update({ userId, updateUserInput }) {
    const result = await this.userRepository.save({
      id: userId,
      ...updateUserInput,
    });
    return result;
  }

  async setPwd({ userId, newPassword }) {
    const result = await this.userRepository.update(
      { userNumber: userId },
      { password: newPassword },
    );
    return result.affected ? true : false;
  }

  async findAll() {
    const result = await this.userRepository.find({
      relations: ['temperature', 'areas'],
    });
    return result;
  }

  async findUser({ userNumber }) {
    const result = await this.userRepository.findOne({
      where: { userNumber },
      relations: ['temperature', 'areas'],
    });
    return result;
  }
}
