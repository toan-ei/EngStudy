import { ApiProperty } from '@nestjs/swagger';

export class ListeningOptionResponseDto {
  @ApiProperty()
  optionId: number;

  @ApiProperty()
  label: string;

  @ApiProperty()
  text: string;

  @ApiProperty()
  isCorrect: boolean;

  @ApiProperty()
  questionId: number;

  @ApiProperty()
  createdAt: Date;
}
