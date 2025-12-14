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

  @ApiProperty()
  optionA: string;

  @ApiProperty()
  optionB: string;

  @ApiProperty()
  optionC: string;

  @ApiProperty()
  optionD: string;

  @ApiProperty({ description: 'A | B | C | D' })
  correctOption: 'A'|'B'|'C'|'D';

  @ApiProperty()
  score: number;

  @ApiPropertyOptional()
  fileId?: number;

  @ApiPropertyOptional()
  orderIndex?: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
