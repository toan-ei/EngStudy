import { Controller, Post, Body } from '@nestjs/common';
import { ListeningSubmitService } from './listening-submit.service';
import { SubmitListeningDto } from './dto/submit-listening.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Listening Submit')
@Controller('listening-submit')
export class ListeningSubmitController {
  constructor(private readonly service: ListeningSubmitService) {}

  @Post()
  @ApiOperation({ summary: 'User nộp bài listening & chấm điểm tự động' })
  async submit(@Body() dto: SubmitListeningDto) {
    return this.service.submit(dto);
  }
}
