import { Module } from '@nestjs/common';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from '../category/entities/category.entity';
import { Image } from '../image/entities/image.entity';
import { ImageService } from '../image/image.service';
import { Payment } from '../payment/entities/payment.entity';
import { User } from '../user/entities/user.entity';
import { Product } from './entities/product.entity';
import { ProductResolver } from './product.resolver';
import { ProductService } from './product.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, User, Payment, Category, Image]),
    ElasticsearchModule.register({
      node: "https://search-my-elasticsearch-5jnh3ad4i3v7gp6s2rgvjh3ezm.us-west-1.es.amazonaws.com:443",
      auth: {
        username: "my-elasticsearch",
        password: "my-elasticsearch2022!A"
      },
      headers: {
        Accept: "application/json",
        'Content-type': 'application/json'
      }
    })
  ],
  providers: [ProductResolver, ProductService, ImageService],
})
export class ProductModule {}
