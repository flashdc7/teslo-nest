import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto, LoginUserDto } from './dto';
import { Repository } from 'typeorm';
import { Auth } from './entities/auth.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Auth)
    private readonly userRepository: Repository<Auth>,

    private readonly jwtService: JwtService,
  ){}

  async create(createUserDto: CreateUserDto) {
    try {
      const { password, ...userData}= createUserDto;
      
      const user= this.userRepository.create( {
        ...userData,
        password: bcrypt.hashSync( password, 10)
      } );
      
      await this.userRepository.save( user );
      delete user.password;

      return {
        ...user,
        token: this.getJwtToken( { email: user.email } )
      };
    } catch (error) {
      this.handleDBError( error );
    }
  }

  async login( loginUserDto: LoginUserDto){
    const {password, email}= loginUserDto
    const user= await this.userRepository.findOne({ 
      where: { email: email.toLowerCase().trim() },
      select: { email: true, password: true }
     })

     if( !user )
      throw new UnauthorizedException('Credentials are not valid (email)')

     if( !bcrypt.compareSync( password, user.password ) )
      throw new UnauthorizedException('Credentials are not valid (password)')

    return {
      ...user,
      token: this.getJwtToken( { email: user.email } )
    }
  }

  private getJwtToken( payload: JwtPayload ){
    const token= this.jwtService.sign( payload );
    return token
  }

  private handleDBError(error:any):never{
    if( error.code === '23505' )
      throw new BadRequestException( error.detail )
    
    console.log(error);

    throw new InternalServerErrorException('Please check server logs')
    
  }

}
