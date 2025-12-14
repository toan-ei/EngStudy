// create-exercise.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateExerciseDto {
  @ApiProperty({ description: 'ID của topic mà bài này thuộc về' })
  topicId: number;

  @ApiProperty({ description: 'Tiêu đề bài nghe' })
  title: string;

  @ApiPropertyOptional({ description: 'Mô tả bài nghe' })
  description?: string;

  @ApiPropertyOptional({ description: 'Thời lượng bài (tính bằng giây)' })
  durationSeconds?: number;
}
