import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ListeningExercise } from './listening-exercises.entity';
import { ListeningExerciseService } from './listening-exercises.service';
import { ListeningExerciseController } from './listening-exercises.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ListeningExercise])],
  controllers: [ListeningExerciseController],
  providers: [ListeningExerciseService],
  exports: [ListeningExerciseService],
})
export class ListeningExerciseModule {}
