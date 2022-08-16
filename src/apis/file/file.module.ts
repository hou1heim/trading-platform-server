import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Image } from '../image/entities/image.entity';
import { ImageService } from '../image/image.service';
import { FileResolver } from './file.resolver';
import { FileService } from './file.service';

@Module({
  imports: [TypeOrmModule.forFeature([Image])],
  providers: [FileResolver, FileService, ImageService],
})
export class FileModule {}
