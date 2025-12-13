// stats.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StatsService } from './stats.serivce';
import { ListeningTopic } from '../listening-topic/listening-topic.entity';
import { ListeningExercise } from 'src/listening-exercises/listening-exercises.entity';
import { ListeningQuestion } from '../listening-question/listening-question.entity';
import { File } from '../files/file.entity';
import { StatsController } from './stats.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ListeningTopic,
      ListeningExercise,
      ListeningQuestion,
      File,
    ]),
  ],
  controllers: [StatsController],
  providers: [StatsService],
  exports: [StatsService],
})
export class StatsModule {}
