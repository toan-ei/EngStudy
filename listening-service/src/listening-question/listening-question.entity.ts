import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ListeningExercise } from '../listening-exercises/listening-exercises.entity';
import { File } from '../files/file.entity';

@Entity('listening_questions')
export class ListeningQuestion {
  @PrimaryGeneratedColumn({ name: 'question_id' })
  questionId: number;

  @ManyToOne(() => ListeningExercise, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'exercise_id' })
  exercise: ListeningExercise;

  @Column('text')
  questionText: string;

  @Column('text', { nullable: true })
  description?: string;

  @ManyToOne(() => File, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'file_id' })
  file?: File;

  @Column({ type: 'int', default: 0 })
  orderIndex: number;

  @Column({ type: 'tinyint', default: 0 })
  isDeleted: boolean;

  @CreateDateColumn({ type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime' })
  updatedAt: Date;
}
