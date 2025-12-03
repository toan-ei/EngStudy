import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ListeningOption } from './listening-option.entity';
import { ListeningQuestion } from '../listening-question/listening-question.entity';
import { ListeningOptionsService } from './listening-options.service';
import { ListeningOptionsController } from './listening-options.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ListeningOption, ListeningQuestion])],
  controllers: [ListeningOptionsController],
  providers: [ListeningOptionsService],
})
export class ListeningOptionsModule {}
