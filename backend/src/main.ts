import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
//import { PrismaExceptionFilter } from './common/filters/prisma-exception.filter';
import { ValidationPipe } from '@nestjs/common';
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

  // app.useGlobalPipes(
  //   new ValidationPipe({
  //     whitelist: true,
  //     forbidNonWhitelisted: true,
  //     transform: false, // No transformar automáticamente los tipos
  //   }),
  // );

  // Global validation pipe, configurado para mejorar la validación de forma simple
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      forbidUnknownValues: true,
      disableErrorMessages: false,
    }),
  );

  // Configuración de CORS
  app.enableCors({
    origin: ['http://localhost:4200', 'http://127.0.0.1:4200'], // URLs de Angular
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'], // Métodos permitidos
    allowedHeaders: ['Content-Type', 'Authorization'], // Headers permitidos
    credentials: true, // Para enviar cookies si las necesitas
  });

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
