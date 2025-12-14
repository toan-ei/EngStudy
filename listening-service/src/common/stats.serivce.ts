// stats.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StatsHelper } from '../common/stats.helper';
import { ListeningTopic } from '../listening-topic/listening-topic.entity';
import { ListeningExercise } from 'src/listening-exercises/listening-exercises.entity'; 
import { ListeningQuestion } from '../listening-question/listening-question.entity';
import { File } from '../files/file.entity';

@Injectable()
export class StatsService {
  private topicStats: StatsHelper<ListeningTopic>;
  private exerciseStats: StatsHelper<ListeningExercise>;
  private questionStats: StatsHelper<ListeningQuestion>;
  private fileStats: StatsHelper<File>;

  constructor(
    @InjectRepository(ListeningTopic)
    private topicRepo: Repository<ListeningTopic>,

    @InjectRepository(ListeningExercise)
    private exerciseRepo: Repository<ListeningExercise>,

    @InjectRepository(ListeningQuestion)
    private questionRepo: Repository<ListeningQuestion>,

    @InjectRepository(File)
    private fileRepo: Repository<File>,
  ) {
    this.topicStats = new StatsHelper(this.topicRepo);
    this.exerciseStats = new StatsHelper(this.exerciseRepo);
    this.questionStats = new StatsHelper(this.questionRepo);
    this.fileStats = new StatsHelper(this.fileRepo);
  }

  countTopicTotal() {
    return this.topicStats.countTotal();
  }
  countTopicByMonth(year: number) {
    return this.topicStats.countByMonth(year);
  }

  countExerciseTotal() {
    return this.exerciseStats.countTotal();
  }
  countExerciseByMonth(year: number) {
    return this.exerciseStats.countByMonth(year);
  }

  countQuestionTotal() {
    return this.questionStats.countTotal();
  }
  countQuestionByMonth(year: number) {
    return this.questionStats.countByMonth(year);
  }

  countFileTotal() {
    return this.fileStats.countTotal();
  }
  countFileByMonth(year: number) {
    return this.fileStats.countByMonth(year);
  }
}

