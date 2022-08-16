import { CacheModule, Module } from '@nestjs/common';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductModule } from './apis/product/product.module';
import { PaymentModule } from './apis/payment/payment.module';
import { CategoryModule } from './apis/category/category.module';
import { UserTempModule } from './apis/userTemp/userTemp.module';
import { AuthModule } from './apis/auth/auth.module';
import { FileModule } from './apis/file/file.module';
import { ImageModule } from './apis/image/image.module';
import * as redisStore from 'cache-manager-redis-store';
import { RedisClientOptions } from 'redis';
import { UserModule } from './apis/user/user.module';

@Module({
  imports: [
    ImageModule,
    FileModule,
    PaymentModule,
    AuthModule,
    UserModule,
    UserTempModule,
    CategoryModule,
    ProductModule,
    PaymentModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'src/commons/graphql/schema.gql',
      context: ({ req, res }) => ({ req, res }),
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: '10.13.16.3',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'myserver',
      entities: [__dirname + '/apis/**/*.entity.*'],
      synchronize: true,
      logging: true,
    }),
    CacheModule.register<RedisClientOptions>({
      store: redisStore,
      url: 'redis://10.13.17.3:6379',
      isGlobal: true
    })
  ],
  //controllers: [AppController],
  //providers: [AppService],
})
export class AppModule {}
