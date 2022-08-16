import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Image } from './entities/image.entity';

@Injectable()
export class ImageService {
  constructor(
    @InjectRepository(Image)
    private readonly imageRepository: Repository<Image>,
  ) {}

  async create({ src }) {
    const image = await this.imageRepository.save({
      src,
      uploadedAt: new Date(),
    });
    return image;
  }

  async delete({ imageId }) {
    const result = await this.imageRepository.softDelete({ id: imageId });
    return result.affected ? true : false;
  }
}
