import { ApiProperty } from '@nestjs/swagger';

export class AnswerDto {
  @ApiProperty({ description: 'ID của câu hỏi' })
  questionId: number;

  @ApiProperty({ description: 'ID của đáp án đã chọn', required: false })
  selectedOptionId?: number | null;
}

export class SubmitListeningDto {
  @ApiProperty({ description: 'ID của bài nghe' })
  exerciseId: number;

  @ApiProperty({ description: 'ID của user' })
  userId: string;

  @ApiProperty({ type: [AnswerDto], description: 'Danh sách câu trả lời' })
  answers: AnswerDto[];
}
