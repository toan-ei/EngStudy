import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { ListeningExercise } from '../listening-exercises/listening-exercises.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('user_listening_results')
export class UserListeningResult {
  @ApiProperty()
  @PrimaryGeneratedColumn({ name: 'result_id' })
  resultId: number;

  @ApiProperty()
  @Column({ name: 'user_id', type: 'varchar', length: 100 })
  userId: string;

  @ApiProperty()
  @Column({ name: 'total_score', type: 'int' })
  totalScore: number;

  @ApiProperty()
  @Column({ name: 'max_score', type: 'int' })
  maxScore: number;

  @ApiProperty()
  @Column({ type: 'float', nullable: true })
  percent: number;

  @ApiProperty()
  @CreateDateColumn({ name: 'date_submitted_at', type: 'datetime' })
  dateSubmittedAt: Date;

  @ApiProperty()
  @Column({ name: 'is_deleted', type: 'tinyint', default: 0 })
  isDeleted: boolean;

  // FK exercise_id
  @ManyToOne(() => ListeningExercise, { onDelete: 'CASCADE' })
  exercise: ListeningExercise;
}
