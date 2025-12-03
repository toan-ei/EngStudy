import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { ListeningOptionsService } from './listening-options.service';
import { CreateListeningOptionDto } from './dto/create-listening-option.dto';

@ApiTags('Listening Options')
@Controller('listening-options')
export class ListeningOptionsController {
  constructor(private readonly service: ListeningOptionsService) {}

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách đáp án, có thể filter theo questionId' })
  @ApiQuery({ name: 'questionId', required: false })
  async findAll(@Query('questionId') questionId?: number) {
    return this.service.findAll(questionId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy chi tiết 1 đáp án' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Tạo mới đáp án' })
  async create(@Body() dto: CreateListeningOptionDto) {
    return this.service.create(dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa đáp án (hard delete)' })
  async delete(@Param('id', ParseIntPipe) id: number) {
    return this.service.delete(id);
  }
}
