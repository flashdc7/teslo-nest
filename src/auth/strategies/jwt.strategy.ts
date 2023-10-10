import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-jwt";
import { Auth } from "../entities/auth.entity";
import { JwtPayload } from "../interfaces/jwt-payload.interface";


export class JwtStrategy extends PassportStrategy (Strategy){

    async validate( payload: JwtPayload ): Promise<Auth>{
        const { email }=payload
        
        return ;
    }
}