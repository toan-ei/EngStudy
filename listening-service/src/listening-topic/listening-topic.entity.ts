import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('listening_topics')
export class ListeningTopic {
  @PrimaryGeneratedColumn({ name: 'topic_id' })
  topicId: number;

  @Column({ type: 'varchar', length: 255 , name: 'topic_name'})
  topicName: string;

  @Column({ type: 'text', nullable: true, name: 'description' })
  description: string | null;

  @Column({ default: false, name: 'is_deleted' })
  isDeleted: boolean;

  @CreateDateColumn({ name: 'create_at', type: 'timestamp', precision: 6, default: () => 'CURRENT_TIMESTAMP(6)'})
  createdAt: Date;

  @UpdateDateColumn({ name: 'update_at', type: 'timestamp', precision: 6, default: () => 'CURRENT_TIMESTAMP(6)', onUpdate: 'CURRENT_TIMESTAMP(6)' })
  updatedAt: Date;
}