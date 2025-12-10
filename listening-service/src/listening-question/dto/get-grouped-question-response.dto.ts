import { ApiProperty } from '@nestjs/swagger';
import { ExerciseGroupDto } from './create-group.dto';

export class GetGroupedQuestionResponseDto {
  @ApiProperty({ type: [ExerciseGroupDto] })
  data: ExerciseGroupDto[];
}
