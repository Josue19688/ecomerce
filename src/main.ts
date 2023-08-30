import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const logger =  new Logger('Bootstrap');
  app.enableCors();

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.setGlobalPrefix('api/v1');
  const config = new DocumentBuilder()
    .setTitle('E-commerce RESTFull API')
    .setDescription('Endpoint controles ')
    .setVersion('1.0')
    .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/v1', app, document);

  await app.listen(process.env.PORT);
  logger.log(`App running on port ${process.env.PORT}`);
}
bootstrap();
