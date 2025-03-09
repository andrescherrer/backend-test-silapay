import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, BadRequestException } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: (errors) => {
        return new BadRequestException({
          statusCode: 400,
          message: 'Erro de validação',
          errors: errors.map((err) => ({
            campo: err.property,
            erros: err.constraints ? Object.values(err.constraints) : [],
          })),
        });
      },
    }),
  );

  await app.listen(3000);
}
bootstrap();
