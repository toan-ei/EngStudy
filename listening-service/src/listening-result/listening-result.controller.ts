import { Controller, Get, Post, Delete, Param, Body, ParseIntPipe } from '@nestjs/common';
import { UserListeningResultsService } from './listening-result.service';
import { CreateUserListeningResultDto } from './dto/create-user-result.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('User Listening Results')
@Controller('user-listening-results')
export class UserListeningResultsController {
  constructor(private readonly service: UserListeningResultsService) {}

  @Get()
  @ApiOperation({ summary: 'Lấy tất cả kết quả' })
  async findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy kết quả theo ID' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Nộp bài (tính điểm)' })
  async create(@Body() dto: CreateUserListeningResultDto) {
    return this.service.create(dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Soft delete kết quả' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.softDelete(id);
  }
}
