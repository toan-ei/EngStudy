import { Controller, Get, Post, Put, Delete, Param, Body, ParseIntPipe, Query } from '@nestjs/common';
import { ListeningQuestionService } from './listening-question.service';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { CreateListeningQuestionDto } from './dto/create-question.dto';
import { UpdateListeningQuestionDto } from './dto/update-question.dto';
import { ListeningQuestionResponseDto } from './dto/response-question.dto';

@ApiTags('Listening Questions')
@Controller('listening/questions')
export class ListeningQuestionController {
  constructor(private readonly service: ListeningQuestionService) {}

  @Get()
  @ApiOperation({ summary: 'Lấy toàn bộ câu hỏi; có thể lọc theo exerciseId' })
  @ApiQuery({ name: 'exerciseId', required: false })
  @ApiQuery({ name: 'skip', required: false })
  @ApiQuery({ name: 'take', required: false })
  async findAll(
    @Query('exerciseId') exerciseId?: string,
    @Query('skip') skip?: string,
    @Query('take') take?: string,
  ): Promise<ListeningQuestionResponseDto[]> {
    const exId = exerciseId ? Number(exerciseId) : undefined;
    const s = skip ? Number(skip) : 0;
    const t = take ? Number(take) : 50;
    return this.service.findAll(exId, s, t);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy câu hỏi theo id' })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<ListeningQuestionResponseDto> {
    return this.service.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Tạo câu hỏi và 4 đáp án đi kèm, với thiết lập đáp án đúng' })
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
  @ApiOperation({ summary: 'Xóa câu hỏi' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.service.softDelete(id);
    return { message: 'Deleted' };
  }
}