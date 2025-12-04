import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ListeningQuestion } from 'src/listening-question/listening-question.entity';
import { UserListeningResult } from 'src/listening-result/listening-result.entity';

@Entity('user_listening_answers')
export class UserListeningAnswer {
  @PrimaryGeneratedColumn({ name: 'answer_id' })
  answerId: number;

  @Column({ name: 'result_id' })
  resultId: number;

  @Column({ name: 'question_id' })
  questionId: number;

  @Column({ name: 'selected_option', type: 'char', length: 1, nullable: true })
  selectedOption?: 'A' | 'B' | 'C' | 'D' | null;

  @Column({ name: 'is_correct', type: 'tinyint', default: 0 })
  isCorrect: boolean;

  @CreateDateColumn({ name: 'answered_at', type: 'datetime' })
  answeredAt: Date;

  @ManyToOne(() => ListeningQuestion, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'question_id' })
  question: ListeningQuestion;

  @ManyToOne(() => UserListeningResult, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'result_id' })
  result: UserListeningResult;
}
