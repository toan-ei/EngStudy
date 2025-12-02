import { Controller, Get, Post, Put, Delete, Param, Body, ParseIntPipe } from '@nestjs/common';
import { ListeningQuestionService } from './listening-question.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CreateListeningQuestionDto } from './dto/create-question.dto';
import { UpdateListeningQuestionDto } from './dto/update-question.dto';
import { ListeningQuestionResponseDto } from './dto/response-question.dto';

@ApiTags('Listening Questions')
@Controller('listening/questions')
export class ListeningQuestionController {
  constructor(private readonly service: ListeningQuestionService) {}

  @Get()
  @ApiOperation({ summary: 'Lấy tất cả câu hỏi' })
  async findAll(): Promise<ListeningQuestionResponseDto[]> {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy câu hỏi theo ID' })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<ListeningQuestionResponseDto> {
    return this.service.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Tạo câu hỏi mới' })
  async create(@Body() dto: CreateListeningQuestionDto): Promise<ListeningQuestionResponseDto> {
    return this.service.create(dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Cập nhật câu hỏi' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateListeningQuestionDto,
  ): Promise<ListeningQuestionResponseDto> {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa câu hỏi (soft delete)' })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<ListeningQuestionResponseDto> {
    return this.service.softDelete(id);
  }
}
