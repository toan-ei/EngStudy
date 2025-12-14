// dto/update-file.dto.ts
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateFileDto {
  @ApiPropertyOptional({
    type: 'string',
    format: 'binary',
    description: 'Audio file (.m4a, .mp3, .wav)',
  })
  audio?: any;

  @ApiPropertyOptional({
    type: 'string',
    format: 'binary',
    description: 'Image file (.jpg, .png)',
  })
  image?: any;
}
