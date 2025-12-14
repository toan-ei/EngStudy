import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe } from '@nestjs/common';
import { ListeningTopicService } from './listening-topic.service';
import { CreateTopicDto } from './dto/create-topic.dto';
import { UpdateTopicDto } from './dto/update-topic.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Listening Topics')
@Controller('listening/topics')
export class ListeningTopicController {
  constructor(private readonly service: ListeningTopicService) {}

  @Get()
  @ApiOperation({ summary: 'Lấy tất cả topic' })
  getAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy topic theo ID' })
  getOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Tạo topic mới' })
  create(@Body() dto: CreateTopicDto) {
    return this.service.create(dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Cập nhật topic' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateTopicDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa topic (soft delete)' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.softDelete(id);
  }
}
