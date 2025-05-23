import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AuthModule);

  app.enableCors({
    origin: ["*"],
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('Reverbrate API')
    .setDescription('API do projeto Reverbrate')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3002, '0.0.0.0');
}
bootstrap();
