import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { Repository } from 'typeorm';
import { Auth } from './entities/auth.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Auth)
    private readonly userRepository: Repository<Auth>
  ){}

  async create(createUserDto: CreateUserDto) {
    try {
      const user= this.userRepository.create( createUserDto );
      
      return await this.userRepository.save( user );
    } catch (error) {
      this.handleDBError( error );
    }
  }

  private handleDBError(error:any):never{
    if( error.code === '23505' )
      throw new BadRequestException( error.detail )
    
    console.log(error);

    throw new InternalServerErrorException('Please check server logs')
    
  }

}
