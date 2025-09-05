import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
//import { PrismaExceptionFilter } from './common/filters/prisma-exception.filter';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Servir archivos estáticos
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  // Global filters
  app.useGlobalFilters(new HttpExceptionFilter());
  //app.useGlobalFilters(new PrismaExceptionFilter());

  // Para mostrar errores detallados en desarrollo, descomenta el siguiente bloque

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: (errors) => {
        const messages = errors.map((error) => {
          // Si hay constraints (errores de validación del DTO)
          if (error.constraints) {
            const constraintMessages = Object.values(error.constraints).map(
              (message: string) => {
                // Reemplazar mensajes en inglés por español
                if (message.includes('should not exist')) {
                  return `La propiedad '${error.property}' no está permitida`;
                }
                return message;
              },
            );
            return constraintMessages.join(', ');
          }
          // Si es una propiedad no permitida sin constraints
          return `La propiedad '${error.property}' no está permitida`;
        });
        return new BadRequestException({
          statusCode: 400,
          error: 'Datos inválidos',
          message: messages,
        });
      },
    }),
  );

  // Global validation pipe, configurado para mejorar la validación de forma simple
  // app.useGlobalPipes(
  //   new ValidationPipe({
  //     whitelist: true,
  //     forbidNonWhitelisted: true,
  //     transform: true,
  //     forbidUnknownValues: true,
  //     disableErrorMessages: false,
  //   }),
  // );

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
