import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ListeningTopic } from '../listening-topic/listening-topic.entity';

@Entity('listening_exercises')
export class ListeningExercise {
  @PrimaryGeneratedColumn({ name: 'exercise_id' })
  exerciseId: number;

  @Column()
  topicId: number;

  @ManyToOne(() => ListeningTopic)
  @JoinColumn({ name: 'topic_id' })
  topic: ListeningTopic;

  @Column({ length: 512 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'int', nullable: true })
  durationSeconds?: number;

  @Column({ type: 'tinyint', default: 0 })
  isDeleted: boolean;

  @CreateDateColumn({ type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime' })
  updatedAt: Date;
}
