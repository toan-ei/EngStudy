import { ApiProperty } from '@nestjs/swagger';
import { QuestionItemDto } from './question-item.dto';

export class ExerciseGroupDto {
  @ApiProperty()
  exerciseId: number;

  @ApiProperty()
  exerciseTitle: string;

  @ApiProperty({ nullable: true })
  audioUrl: string | null;

  @ApiProperty({ nullable: true })
  imageUrl: string | null;

  @ApiProperty({ type: [QuestionItemDto] })
  questions: QuestionItemDto[];
}
