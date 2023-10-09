import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Auth } from './entities/auth.entity';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService, TypeOrmModule],
  imports: [TypeOrmModule.forFeature([Auth])]
})
export class AuthModule {}
