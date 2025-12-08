import { ApiProperty } from '@nestjs/swagger';

export class ListeningQuestionForStudyDto {
  @ApiProperty()
  questionId: number;

  @ApiProperty()
  exerciseId: number;

  @ApiProperty()
  exerciseTitle: string;

  @ApiProperty()
  questionText: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  optionA: string;

  @ApiProperty()
  optionB: string;

  @ApiProperty()
  optionC: string;

  @ApiProperty()
  optionD: string;

  @ApiProperty()
  fileId: number;

  @ApiProperty()
  score: number;

  @ApiProperty()
  orderIndex: number;

  @ApiProperty()
  audioUrl?: string;

  @ApiProperty()
  imageUrl?: string;
}

