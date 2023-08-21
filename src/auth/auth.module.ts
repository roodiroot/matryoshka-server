import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '@user/user.module';

@Module({
  providers: [AuthService],
  controllers: [AuthController],
  imports: [PassportModule, JwtModule.register(), UserModule],
})
export class AuthModule {}
