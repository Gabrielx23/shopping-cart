import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as bodyParser from 'body-parser';
import {EnvKeyEnum} from "./env-key.enum";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const maxPayloadSize = configService.get(EnvKeyEnum.MaxPayloadSize);

  app.enableCors();
  app.use(bodyParser.json({limit: maxPayloadSize}));
  app.use(bodyParser.urlencoded({limit: maxPayloadSize, extended: true}));

  const options = new DocumentBuilder()
      .setTitle(configService.get(EnvKeyEnum.SwaggerTitle))
      .setDescription(configService.get(EnvKeyEnum.SwaggerDescription))
      .setVersion(configService.get(EnvKeyEnum.SwaggerVersion))
      .addBearerAuth({ in: 'header', type: 'http' })
      .build();

  const document = SwaggerModule.createDocument(app, options);

  SwaggerModule.setup(configService.get(EnvKeyEnum.SwaggerUri), app, document);

  await app.listen(process.env.PORT);
}

bootstrap();
