import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  Unique,
} from 'typeorm';
import { ListeningQuestion } from '../listening-question/listening-question.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('listening_options')
@Unique(['question', 'label'])
export class ListeningOption {
  @ApiProperty()
  @PrimaryGeneratedColumn({ name: 'option_id' })
  optionId: number;

  @ApiProperty({ example: 'A' })
  @Column({ type: 'char', length: 1 })
  label: string;

  @ApiProperty()
  @Column({ type: 'text' })
  text: string;

  @ApiProperty()
  @Column({ name: 'is_correct', type: 'tinyint', default: 0 })
  isCorrect: boolean;

  @ApiProperty()
  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  createdAt: Date;

  @ManyToOne(() => ListeningQuestion, (q) => q.options, {
    onDelete: 'CASCADE',
  })
  question: ListeningQuestion;
}
