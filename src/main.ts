import { NestFactory } from '@nestjs/core';
import {
  SwaggerModule,
  DocumentBuilder,
  SwaggerDocumentOptions,
} from '@nestjs/swagger';
import helmet from 'helmet';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import * as compression from 'compression';
import { ProductsModule } from './products/products.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(compression());

  const config = new DocumentBuilder()
    .setTitle('E-commerce API')
    .setDescription('API documentation for Products, Auth, and Users')
    .setVersion('1.0')
    .addBearerAuth()
    .addCookieAuth('access_token')
    .addTag('auth')
    .addTag('users')
    .addTag('products')
    .setBasePath('api/v1')
    .build();

  const options: SwaggerDocumentOptions = {
    operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
    include: [ProductsModule, AuthModule, UsersModule],
    deepScanRoutes: true,
    ignoreGlobalPrefix: false,
  };

  const document = SwaggerModule.createDocument(app, config, options);

  document.servers = [
    {
      url: '/api/v1',
      description: 'API v1',
    },
  ];

  SwaggerModule.setup('api/docs', app, document, {
    customSiteTitle: 'E-commerce API Documentation',
    swaggerOptions: {
      persistAuthorization: true,
      defaultModelsExpandDepth: 1,
      defaultModelExpandDepth: 1,
      defaultModelRendering: 'model',
    },
    customCss: '.swagger-ui .topbar { display: none }',
  });

  app.use(helmet());
  app.use(cookieParser());
  app.enableCors();
  app.setGlobalPrefix('api/v1/');
  await app.listen(3000);
}
bootstrap();
