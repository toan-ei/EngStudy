import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ListeningSubmitService } from './listening-submit.service';
import { ListeningSubmitController } from './listening-submit.controller';
import { ListeningQuestion } from '../listening-question/listening-question.entity';
import { UserListeningAnswer } from './listening-answers.entity';
import { UserListeningResult } from 'src/listening-result/listening-result.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ListeningQuestion,
      UserListeningAnswer,
      UserListeningResult,
    ]),
  ],
  controllers: [ListeningSubmitController],
  providers: [ListeningSubmitService],
})
export class ListeningSubmitModule {}
