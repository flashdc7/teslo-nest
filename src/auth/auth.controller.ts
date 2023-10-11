import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from './dto';
import { AuthGuard } from '@nestjs/passport';
import { getUser, RawHeader } from './decorators';
import { Auth } from './entities/auth.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto); 
  }

  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto){
    return this.authService.login(loginUserDto); 
  }

  @Get('private')
  @UseGuards( AuthGuard() )
  testingPrivateRoute( 
    @getUser() user: Auth,
    @getUser('email') userEmail: string,
    @Req() request: Express.Request,

    @RawHeader() rawheaders:string[]
    ){
    // console.log( request );
    // console.log( user );
    
    return {
      ok: true,
      message: 'Hola mundo privado',
      user,
      userEmail,
      rawheaders
    }
  }
}
