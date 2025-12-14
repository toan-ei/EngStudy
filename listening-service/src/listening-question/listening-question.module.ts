import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ListeningQuestionService } from './listening-question.service';
import { ListeningQuestionController } from './listening-question.controller';
import { ListeningQuestion } from './listening-question.entity';
import { ListeningExercise } from '../listening-exercises/listening-exercises.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ListeningQuestion, ListeningExercise])],
  controllers: [ListeningQuestionController],
  providers: [ListeningQuestionService],
  exports: [ListeningQuestionService],
})
export class ListeningQuestionModule {}
