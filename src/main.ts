import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const allowedOrigins = [
    'http://localhost:5173',  // Tu frontend local
    'http://localhost:3001',  // Otros posibles orígenes
    'https://frontend-empleados-theta.vercel.app', // Frontend en producción
    'https://frontend-empleados-git-main-kanracodes-projects.vercel.app',
    'https://frontend-empleados-kanracodes-projects.vercel.app' 
  ]
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') || 3000;
  // Configuración de CORS

  
  app.enableCors({
    origin: (origin, callback) => {
      console.log('Solicitud CORS desde el origin:', origin); // Log para ver el origin recibido
      // Permite solicitudes sin origin (por ejemplo, desde Postman)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        console.error(`Origin no permitido: ${origin}`);
        return callback(new Error('No permitido por CORS'));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204
  });


  // app.enableCors({
  //   origin: true,
  //   methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  //   allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  //   credentials: true,
  //   preflightContinue: false,
  //   optionsSuccessStatus: 204
  // }); //allow all origins to see if it works
  
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
  Logger.log(`Fuentes disponibles${allowedOrigins}`);
}

bootstrap();