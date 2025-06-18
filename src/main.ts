import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AuthModule);
  const configService = app.get(ConfigService);

  app.use(cookieParser());

  // app.enableCors({
  //   origin: '*',
  //   credentials: true,
  // });

  const config = new DocumentBuilder()
    .setTitle('Reverbrate API')
    .setDescription('API do projeto Reverbrate')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  const port = configService.get<number>('BACKEND_PORT') || 5000;
  await app.listen(port, '0.0.0.0');
}
bootstrap();
