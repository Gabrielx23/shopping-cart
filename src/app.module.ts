import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {ConfigModule} from '@nestjs/config';
import {DatabaseConfig} from './database.config';
import {databaseCredentialsConfig} from "./database-credentials.config";
import {UserModule} from "./User/user.module";
import {ProductModule} from "./Product/product.module";
import {StorageController} from "./storage.controller";

@Module({
    imports: [
        UserModule,
        ProductModule,
        ConfigModule.forRoot({
            isGlobal: true,
            load: [databaseCredentialsConfig],
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
