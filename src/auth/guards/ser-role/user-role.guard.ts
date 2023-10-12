import { BadRequestException, CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { Auth } from 'src/auth/entities/auth.entity';

@Injectable()
export class UserRoleGuard implements CanActivate {

  constructor(
    private readonly reflector: Reflector
  ){}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {

    const validRoles: string[]= this.reflector.get('roles', context.getHandler())

    // console.log({ validRoles });
    const req= context.switchToHttp().getRequest()
    const user= req.user as Auth

    if( !user )
      throw new BadRequestException('User not found')

    // console.log({userRoles: user.roles});
    for( const role of user.roles ){
      if( validRoles.includes( role ) ){
        return true
      }
    }
    
    throw new ForbiddenException(`User ${user.fullName } need a valid role: [${validRoles}]`)
  }
}
