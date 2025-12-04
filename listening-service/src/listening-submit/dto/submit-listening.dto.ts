import { ApiProperty } from '@nestjs/swagger';

export class AnswerDto {
  @ApiProperty({ description: 'ID của câu hỏi' })
  questionId: number;

  @ApiProperty({ description: 'Lựa chọn đã chọn: A | B | C | D', required: false, enum: ['A', 'B', 'C', 'D'] })
  selectedOption?: 'A' | 'B' | 'C' | 'D' | null;
}

export class SubmitListeningDto {
  @ApiProperty({ description: 'ID của bài nghe' })
  exerciseId: number;

  @ApiProperty({ description: 'ID của user' })
  userId: string;

  @ApiProperty({ type: [AnswerDto], description: 'Danh sách câu trả lời' })
  answers: AnswerDto[];
}
