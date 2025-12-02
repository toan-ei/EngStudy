import { ApiPropertyOptional } from '@nestjs/swagger';

export class UploadFileDto {
  @ApiPropertyOptional({ type: 'string', format: 'binary', description: 'Audio file (mp3/wav)' })
  audio?: any;

  @ApiPropertyOptional({ type: 'string', format: 'binary', description: 'Image file (jpg/png)' })
  image?: any;
}
