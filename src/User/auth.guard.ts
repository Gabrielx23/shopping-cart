import {CanActivate, ExecutionContext, Injectable, Scope} from '@nestjs/common';
import {AuthService} from "./Services/auth.service";
import {JwtTokenTypeEnum} from "./Enum/jwt-token-type.enum";
import {UserRepository} from "./Repositories/user.repository";
import {InjectRepository} from "@nestjs/typeorm";
import {AuthException} from "./Exceptions/auth.exception";

@Injectable({scope: Scope.REQUEST})
export class AuthGuard implements CanActivate {
    constructor(
        @InjectRepository(UserRepository)
        private readonly users: UserRepository,
        private readonly authService: AuthService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = request.headers.authorization;
        const payload = await this.authService.decodeToken(token, JwtTokenTypeEnum.token);
        const user = await this.users.findOne({email: payload?.email});

        if (!user || user.token !== token) {
          throw AuthException.incorrectAuthorizationToken();
        }

        request.user = user;

        return true;
    }
}
