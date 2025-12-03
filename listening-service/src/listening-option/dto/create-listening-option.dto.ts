import { ApiProperty } from '@nestjs/swagger';

export class CreateListeningOptionDto {
  @ApiProperty({ example: 10 })
  questionId: number;

  @ApiProperty({ example: 'A' })
  label: string;

  @ApiProperty({ example: 'The boy is reading a book.' })
  text: string;

  @ApiProperty({ example: false })
  isCorrect: boolean;
}
