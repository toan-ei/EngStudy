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

  @Column({ name: 'exercise_id' })
  exerciseId: number;

  @Column('text')
  questionText: string;

  @Column({ name: 'description', type: 'text', nullable: true })
  description?: string;

  @Column({ name: 'option_a', type: 'text' })
  optionA: string;

  @Column({ name: 'option_b', type: 'text' })
  optionB: string;

  @Column({ name: 'option_c', type: 'text' })
  optionC: string;

  @Column({ name: 'option_d', type: 'text' })
  optionD: string;

  @Column({ name: 'correct_option', type: 'char', length: 1 })
  correctOption: 'A' | 'B' | 'C' | 'D';

  @Column({ name: 'score', type: 'float', default: 1 })
  score: number;

  @ManyToOne(() => File , { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'file_id' })
  file: File;

  @Column({ name: 'file_id' })
  fileId: number;

  @Column({ type: 'int', default: 0 })
  orderIndex: number;

  @Column({ type: 'tinyint', default: 0 })
  isDeleted: boolean;

  @CreateDateColumn({ type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime' })
  updatedAt: Date;
  options: any;
}
