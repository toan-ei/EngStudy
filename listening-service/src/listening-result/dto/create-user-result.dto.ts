import { ApiProperty } from '@nestjs/swagger';

export class CreateUserListeningResultDto {
  @ApiProperty({ example: 'user123' })
  userId: string;

  @ApiProperty({ example: 5 })
  exerciseId: number;

  @ApiProperty({ example: 7 })
  totalScore: number;

  @ApiProperty({ example: 10 })
  maxScore: number;
}
