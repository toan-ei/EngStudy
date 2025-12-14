// update-exercise.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateExerciseDto } from './create-exercise.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateExerciseDto extends PartialType(CreateExerciseDto) {
  @ApiPropertyOptional({ description: 'ID của topic (nếu muốn đổi)' })
  topicId?: number;
}
