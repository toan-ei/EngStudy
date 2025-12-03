import { ApiProperty } from '@nestjs/swagger';
import { ListeningExercise } from '../../listening-exercises/listening-exercises.entity';

export class UserListeningResultResponseDto {
  @ApiProperty()
  resultId: number;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  totalScore: number;

  @ApiProperty()
  maxScore: number;

  @ApiProperty()
  percent: number;

  @ApiProperty({ type: () => ListeningExercise })
  exercise: ListeningExercise;

  @ApiProperty()
  dateSubmittedAt: Date;
}
