import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.enableCors();
  app.use(bodyParser.json({limit: '50mb'}));
  app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

  const options = new DocumentBuilder()
      .setTitle(configService.get('SWAGGER_TITLE'))
      .setDescription(configService.get('SWAGGER_DESCRIPTION'))
      .setVersion(configService.get('SWAGGER_VERSION'))
      .addBearerAuth({ in: 'header', type: 'http' })
      .build();

  const document = SwaggerModule.createDocument(app, options);

  SwaggerModule.setup('api', app, document);

  await app.listen(configService.get('PORT'));
}

bootstrap();
