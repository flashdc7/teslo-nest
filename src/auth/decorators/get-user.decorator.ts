import { ExecutionContext, InternalServerErrorException, createParamDecorator } from "@nestjs/common";


export const getUser= createParamDecorator(
    (data:string, ctx: ExecutionContext)=>{
        const req= ctx.switchToHttp().getRequest()
        const user= req.user;
        console.log(data);
        

        if( !user )
            throw new InternalServerErrorException('User not found (request)')
        
        // if( !data ){
        //     return user
        // }else{
        //     return user[data]
        // }

        return ( !data ) ? user : user[data]
    }
)