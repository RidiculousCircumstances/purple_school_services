import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { getMongoConfig } from '../config/mongo.config';

@Module({
  imports: [
    UserModule,
    AuthModule,
    MongooseModule.forRootAsync(getMongoConfig()),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: 'envs/.account.env',
    })],
})
export class AppModule { }
