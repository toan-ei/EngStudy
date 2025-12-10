import { ApiProperty } from '@nestjs/swagger';

export class QuestionItemDto {
  @ApiProperty()
  questionId: number;

  @ApiProperty()
  questionText: string;

  @ApiProperty({ required: false })
  description?: string;

  @ApiProperty()
  optionA: string;

  @ApiProperty()
  optionB: string;

  @ApiProperty()
  optionC: string;

  @ApiProperty()
  optionD: string;

  @ApiProperty()
  score: number;
}
