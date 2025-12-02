import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ListeningExercise } from 'src/listening-exercises/listening-exercises.entity';

export class ListeningQuestionResponseDto {
  @ApiProperty()
  questionId: number;

  @ApiProperty({ type: () => ListeningExercise })
  exercise: ListeningExercise;

  @ApiProperty()
  questionText: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiPropertyOptional({ description: 'File ID chứa audio + image' })
  fileId?: string;

  @ApiPropertyOptional()
  orderIndex?: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
