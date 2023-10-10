import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto, LoginUserDto } from './dto';
import { Repository } from 'typeorm';
import { Auth } from './entities/auth.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Auth)
    private readonly userRepository: Repository<Auth>
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

      // Todo: Retornar JWT de acceso
      return user;
    } catch (error) {
      this.handleDBError( error );
    }
  }

  async login( loginUserDto: LoginUserDto){
    const {password, email}= loginUserDto
    const user= await this.userRepository.findOne({ 
      where: { email},
      select: { email: true, password: true }
     })

     if( !user )
      throw new UnauthorizedException('Credentials are not valid (email)')

     if( !bcrypt.compareSync( password, user.password ) )
      throw new UnauthorizedException('Credentials are not valid (password)')

    // Todo: Retorna JWT de acceso
    return user
  }

  private handleDBError(error:any):never{
    if( error.code === '23505' )
      throw new BadRequestException( error.detail )
    
    console.log(error);

    throw new InternalServerErrorException('Please check server logs')
    
  }

}
