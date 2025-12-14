import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ListeningTopicModule } from './listening-topic/listening-topic.module';
import { FilesModule } from './files/files.module';
import { ListeningExerciseModule } from './listening-exercises/listening-exercises.module';
import { ListeningQuestionModule } from './listening-question/listening-question.module';
import { ListeningSubmitModule } from './listening-submit/listening-submit.module';
import { ListeningResultModule } from './listening-result/listening-result.module';
import { StatsModule } from './common/stats.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('English Listening API')
    .setDescription('API backend cho hệ thống luyện nghe tiếng Anh')
    .setVersion('1.0')
    .addTag('Listening Topics')
    .build();

  const document = SwaggerModule.createDocument(app, config, {
    include: [ListeningTopicModule, FilesModule, ListeningExerciseModule, ListeningQuestionModule, ListeningSubmitModule, ListeningResultModule, StatsModule],
  });

  SwaggerModule.setup('api/docs', app, document);

  app.enableCors();

  await app.listen(5001);
  console.log('Server running on http://localhost:5001');
  console.log('Swagger docs on http://localhost:5001/api/docs');
}
bootstrap();
