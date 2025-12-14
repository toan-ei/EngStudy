import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class FileResponseDto {
  @ApiProperty()
  fileId: number;

  @ApiPropertyOptional({ description: 'Audio filename' })
  audioFilename?: string;

  @ApiPropertyOptional({ description: 'Audio URL' })
  audioUrl?: string;

  @ApiPropertyOptional({ description: 'Audio duration in seconds' })
  audioDurationSeconds?: number;

  @ApiPropertyOptional({ description: 'Image filename' })
  imageFilename?: string;

  @ApiPropertyOptional({ description: 'Image URL' })
  imageUrl?: string;

  @ApiPropertyOptional({ description: 'MIME type of the uploaded file' })
  mimeType?: string;

  @ApiProperty()
  createdAt: Date;
}
