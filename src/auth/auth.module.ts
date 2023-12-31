import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Auth } from './entities/auth.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService, TypeOrmModule, JwtStrategy, PassportModule, JwtModule],
  imports: [
    ConfigModule,
    
    TypeOrmModule.forFeature([Auth]),
    PassportModule.register({ defaultStrategy: 'jwt' }),

    JwtModule.registerAsync({
      imports: [ ConfigModule ],
      inject: [ ConfigService ],
      useFactory: ( configService: ConfigService )=>{
        // console.log( 'JWT1: ', configService.get('JWT_SECRET') );
        // console.log( 'JWT2: ', process.env.JWT_SECRET );
        
        return {
          // secret: process.env.JWT_SECRET,
          secret: configService.get('JWT_SECRET'),
          signOptions:{
            expiresIn: '12h'
          }
        }
      }
    })

    // JwtModule.register({ 
    //   secret: process.env.JWT_SECRET,
    //   signOptions:{
    //     expiresIn: '2h'
    //   }
    // })
  ]
})
export class AuthModule {}
