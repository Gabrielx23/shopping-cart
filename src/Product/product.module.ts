import {Module} from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import {ProductRepository} from "./Repositories/product.repository";
import {controllers} from "./Controllers";
import {services} from "./Services";
import {UserModule} from "../User/user.module";

@Module({
    imports: [
        UserModule,
        TypeOrmModule.forFeature([ProductRepository]),
    ],
    controllers: [...controllers],
    providers: [...services],
    exports: [],
})
export class ProductModule {
}
