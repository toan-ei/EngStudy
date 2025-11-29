import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('English Listening API')
    .setDescription('API backend cho hệ thống luyện nghe tiếng Anh')
    .setVersion('1.0')
    .addTag('listening')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  app.enableCors();

  await app.listen(5001);
  console.log('Server running on http://localhost:5001');
}
bootstrap();
