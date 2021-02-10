import {Module} from '@nestjs/common';
import {controllers} from "./Controllers";
import {UserRepository} from "./Repositories/user.repository";
import {TypeOrmModule} from "@nestjs/typeorm";
import {services} from "./Services";
import {CreateUserService} from "./Services/create-user.service";
import {AuthService} from "./Services/auth.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([UserRepository]),
    ],
    controllers: [...controllers],
    providers: [...services],
    exports: [CreateUserService, AuthService],
})
export class UserModule {
}
