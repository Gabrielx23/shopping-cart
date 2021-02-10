import {Module} from '@nestjs/common';
import {controllers} from "./Controllers";
import {UserModule} from "../User/user.module";
import {services} from "./Services";

@Module({
    imports: [
        UserModule
    ],
    controllers: [...controllers],
    providers: [...services],
    exports: [],
})
export class AuthModule {
}
