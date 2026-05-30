import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from '../users/users.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AuthGuard } from './guard/auth.guard';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
  secret:
    configService.get<string>('JWT_SECRET') ??
    'fallback_secret_key_12345',

  signOptions: {
    expiresIn:
      (configService.get('JWT_EXPIRES_IN') ??
        '1d') as any,
  },
}),
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    AuthGuard,
  ],
  exports: [AuthService, AuthGuard, JwtModule],
})
export class AuthModule {}