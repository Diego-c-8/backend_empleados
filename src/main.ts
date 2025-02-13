import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') || 3000;
  // Configuración de CORS
  app.enableCors({
    // Orígenes permitidos - en desarrollo podrías tener varios orígenes
    origin: [
      'http://localhost:5173',  // Tu frontend local
      'http://localhost:3001',  // Otros posibles orígenes
      'https://frontend-empleados-theta.vercel.app' // Frontend en producción
      
    ],
    // Métodos HTTP permitidos
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    // Cabeceras permitidas
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    // Permitir enviar cookies o credenciales
    credentials: true,
    // Tiempo que se guarda en caché la respuesta de preflight
    preflightContinue: false,
    optionsSuccessStatus: 204
  });
  
  await app.init();

  const config = new DocumentBuilder()
    .setTitle('Employee API')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  const paths = Object.keys(document.paths);
  
  Logger.log('Registered routes:');
  paths.forEach(path => {
    const methods = Object.keys(document.paths[path]);
    Logger.log(`${methods.join(', ')} -> ${path}`);
  });

  await app.listen(port);
  Logger.log(`Application is running on: http://localhost:${port}`);
}

bootstrap();