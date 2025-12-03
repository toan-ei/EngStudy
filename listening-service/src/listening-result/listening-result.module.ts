import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserListeningResult } from './listening-result.entity';
import { ListeningExercise } from '../listening-exercises/listening-exercises.entity';
import { UserListeningResultsService } from './listening-result.service';
import { UserListeningResultsController } from './listening-result.controller';

@Module({
    imports: [TypeOrmModule.forFeature([UserListeningResult, ListeningExercise])],
    controllers: [UserListeningResultsController],
    providers: [UserListeningResultsService],
    exports: [UserListeningResultsService],
})
export class ListeningResultModule {}