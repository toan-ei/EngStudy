import { IsString, IsOptional, IsInt } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateListeningQuestionDto {
  @ApiProperty({ description: 'ID bài listening mà câu hỏi thuộc về' })
  exerciseId: number;

  @ApiProperty({ description: 'Nội dung câu hỏi' })
  @IsString()
  questionText: string;

  @ApiPropertyOptional({ description: 'Mô tả thêm hoặc ghi chú' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'ID file chứa audio + image' })
  @IsOptional()
  @IsString()
  fileId?: string;

  @ApiPropertyOptional({ description: 'Thứ tự câu hỏi trong bài' })
  @IsOptional()
  @IsInt()
  orderIndex?: number;
}
