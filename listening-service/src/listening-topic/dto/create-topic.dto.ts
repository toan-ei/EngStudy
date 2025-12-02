import { IsString, IsOptional, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTopicDto {
  @IsString()
  @MaxLength(255)
  @ApiProperty({ description: 'Tên topic', maxLength: 255 })
  topicName: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'Mô tả topic' })
  description?: string;
}
