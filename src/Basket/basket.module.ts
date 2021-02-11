import {Module} from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import {UserModule} from "../User/user.module";
import {BasketElementRepository} from "./Repositories/basket-element.repository";
import {controllers} from "./Controllers";
import {services} from "./Services";
import {ProductModule} from "../Product/product.module";

@Module({
    imports: [
        UserModule,
        ProductModule,
        TypeOrmModule.forFeature([BasketElementRepository]),
    ],
    controllers: [...controllers],
    providers: [...services],
    exports: [],
})
export class BasketModule {
}
