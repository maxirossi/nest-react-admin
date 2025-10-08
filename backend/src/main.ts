import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as bcrypt from 'bcrypt';
import * as cookieParser from 'cookie-parser';

import { AppModule } from './app.module';
import { Role } from './enums/role.enum';
import { User } from './user/user.entity';

async function createAdminOnFirstUse() {
  const admin = await User.findOne({ where: { username: 'admin' } });

  if (!admin) {
    await User.create({
      firstName: 'admin',
      lastName: 'admin',
      isActive: true,
      username: 'admin',
      role: Role.Admin,
      password: await bcrypt.hash('admin123', 10),
    }).save();
  }
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe());

  const config = new DocumentBuilder()
    .setTitle('Sistema de Gestión de Cursos API')
    .setDescription(`
      API completa para el sistema de gestión de cursos con arquitectura DDD.
      
      ## Características principales:
      - **Autenticación JWT** con refresh tokens
      - **Arquitectura DDD** (Domain-Driven Design)
      - **Health Check** endpoints para monitoreo
      - **Gestión de usuarios** con roles y permisos
      - **Gestión de cursos** y contenidos
      - **Estadísticas** de la aplicación
      
      ## Autenticación:
      - Usa Bearer token en el header Authorization
      - Los refresh tokens se manejan automáticamente via cookies HTTP-only
      
      ## Arquitectura DDD:
      - Separación clara de responsabilidades
      - Domain layer con entidades y value objects
      - Application layer con use cases
      - Infrastructure layer con repositorios
      - Presentation layer con controladores
    `)
    .setVersion('2.0.0')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      name: 'Authorization',
      description: 'Enter JWT token',
      in: 'header',
    })
    .addTag('Authentication', 'Endpoints de autenticación y autorización')
    .addTag('Users', 'Gestión de usuarios con arquitectura DDD')
    .addTag('Courses', 'Gestión de cursos')
    .addTag('Stats', 'Estadísticas de la aplicación')
    .addTag('Health Check', 'Monitoreo de salud de la aplicación')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/api/docs', app, document);

  await createAdminOnFirstUse();

  await app.listen(5000);
}
bootstrap();
