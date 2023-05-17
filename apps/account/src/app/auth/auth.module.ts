import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserRepository } from '../user/repositiories/user.repository';
import { JwtModule } from '@nestjs/jwt';
import { getJwtConfig } from '../../config/jwt.config';

@Module({
  imports: [UserRepository, JwtModule.registerAsync(getJwtConfig())],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule { }
