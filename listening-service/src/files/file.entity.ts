import { Entity, PrimaryColumn, Column, CreateDateColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity('files')
export class File {
  @PrimaryGeneratedColumn({ name: 'file_id' })
  fileId: number;

  @Column({ length: 512, nullable: true })
  audioFilename?: string;

  @Column({ length: 1000, nullable: true })
  audioUrl?: string;

  @Column({ type: 'int', nullable: true })
  audioDurationSeconds?: number;

  @Column({ length: 512, nullable: true })
  imageFilename?: string;

  @Column({ length: 1000, nullable: true })
  imageUrl?: string;

  @Column({ length: 100, nullable: true })
  mimeType?: string;

  @CreateDateColumn({ type: 'datetime' })
  createdAt: Date;

  @Column({ type: 'tinyint', default: 0 })
  isDeleted: boolean;
}