import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, IsIn, IsNumber, Min } from 'class-validator';

export class CreateListeningQuestionDto {
  @ApiProperty({ description: 'ID của exercise (bài nghe) mà câu này thuộc về', example: 1 })
  @IsInt()
  exerciseId: number;

  @ApiProperty({ description: 'Nội dung câu hỏi' })
  @IsString()
  questionText: string;

  @ApiPropertyOptional({ description: 'Mô tả ngắn (ví dụ: level A1/A2)' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Option A' })
  @IsString()
  optionA: string;

  @ApiProperty({ description: 'Option B' })
  @IsString()
  optionB: string;

  @ApiProperty({ description: 'Option C' })
  @IsString()
  optionC: string;

  @ApiProperty({ description: 'Option D' })
  @IsString()
  optionD: string;

  @ApiProperty({ description: 'Correct option - one of A/B/C/D', example: 'D' })
  @IsIn(['A','B','C','D'])
  correctOption: 'A'|'B'|'C'|'D';

  @ApiPropertyOptional({ description: 'Điểm cho câu này (default: 1)' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  score?: number;

  @ApiPropertyOptional({ description: 'fileId (number) cho audio/image dùng chung' })
  @IsOptional()
  @IsInt()
  fileId?: number;

  @ApiPropertyOptional({ description: 'Thứ tự câu trong bài' })
  @IsOptional()
  @IsInt()
  orderIndex?: number;
}
