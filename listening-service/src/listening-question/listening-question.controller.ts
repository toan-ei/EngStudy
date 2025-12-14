import { Controller, Get, Post, Put, Delete, Param, Body, ParseIntPipe, Query } from '@nestjs/common';
import { ListeningQuestionService } from './listening-question.service';
import { ApiTags, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { CreateListeningQuestionDto } from './dto/create-question.dto';
import { UpdateListeningQuestionDto } from './dto/update-question.dto';
import { ListeningQuestionResponseDto } from './dto/response-question.dto';
import { ListeningQuestionForStudyDto } from './dto/get-10-questions-topicId-response';
import { GetGroupedQuestionResponseDto } from './dto/get-grouped-question-response.dto';

@ApiTags('Listening Questions')
@Controller('listening/questions')
export class ListeningQuestionController {
  questionService: any;
  constructor(private readonly service: ListeningQuestionService) {}

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách câu hỏi có phân trang' })
  @ApiQuery({ name: 'exerciseId', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  async findAll(
    @Query('exerciseId') exerciseId?: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    const exId = exerciseId ? Number(exerciseId) : undefined;

    return this.service.paginate(exId, page, limit);
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

  @Get('study/:topicId')
  @ApiOperation({ summary: 'Get 10 random questions for study (unique by fileId)' })
  async getQuestionsByTopic(
    @Param('topicId', ParseIntPipe) topicId: number,
  ): Promise<ListeningQuestionForStudyDto[]> {
    return this.service.get10QuestionsByTopic(topicId);
  }

  @Get('grouped/:topicId')
  @ApiOperation({ summary: 'Lấy câu hỏi theo từng exercise (mỗi exercise 2 câu)' })
  @ApiResponse({
    status: 200,
    type: GetGroupedQuestionResponseDto,
  })
  async getGroupedQuestions(
    @Param('topicId', ParseIntPipe) topicId: number
  ): Promise<GetGroupedQuestionResponseDto> {
    const data = await this.service.getGroupedQuestionsByTopic(topicId);
    return { data };
  }

}