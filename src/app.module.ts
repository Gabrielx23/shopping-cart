import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {ConfigModule} from '@nestjs/config';
import {DatabaseConfig} from './database.config';
import {UserModule} from "./User/user.module";
import {ProductModule} from "./Product/product.module";
import {StorageController} from "./storage.controller";
import {BasketModule} from "./Basket/basket.module";
import {mainConfig} from "./main.config";

@Module({
    imports: [
        BasketModule,
        UserModule,
        ProductModule,
        ConfigModule.forRoot({
            isGlobal: true,
            load: [mainConfig],
        }),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            useClass: DatabaseConfig,
        }),
    ],
    controllers: [StorageController],
    providers: [],
})
export class AppModule {
}
