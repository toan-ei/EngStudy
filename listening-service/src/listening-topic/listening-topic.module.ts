import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ListeningTopicController } from './listening-topic.controller';
import { ListeningTopicService } from './listening-topic.service';
import { ListeningTopic } from './listening-topic.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ListeningTopic])],
  controllers: [ListeningTopicController],
  providers: [ListeningTopicService],
})
export class ListeningTopicModule {}
