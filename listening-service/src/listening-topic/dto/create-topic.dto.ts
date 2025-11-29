import { IsString, IsOptional, MaxLength } from 'class-validator';

export class CreateTopicDto {
  @IsString()
  @MaxLength(255)
  topicName: string;

  @IsOptional()
  @IsString()
  description?: string;
}
