import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ListeningQuestionService } from './listening-question.service';
import { ListeningQuestionController } from './listening-question.controller';
import { ListeningQuestion } from './listening-question.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ListeningQuestion])],
  controllers: [ListeningQuestionController],
  providers: [ListeningQuestionService],
  exports: [ListeningQuestionService],
})
export class ListeningQuestionModule {}
