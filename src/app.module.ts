import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {ConfigModule} from '@nestjs/config';
import {DatabaseConfig} from './database.config';
import {databaseCredentialsConfig} from "./database-credentials.config";
import {AuthModule} from "./Auth/auth.module";
import {UserModule} from "./User/user.module";

@Module({
    imports: [
        AuthModule,
        UserModule,
        ConfigModule.forRoot({
            isGlobal: true,
            load: [databaseCredentialsConfig],
        }),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            useClass: DatabaseConfig,
        }),
    ],
    controllers: [],
    providers: [],
})
export class AppModule {
}
