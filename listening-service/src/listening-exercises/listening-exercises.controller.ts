import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe } from '@nestjs/common';
import { ListeningExerciseService } from './listening-exercises.service';
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { UpdateExerciseDto } from './dto/update-exercise.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ListeningExercise } from './listening-exercises.entity';

@ApiTags('Listening Exercises')
@Controller('listening/exercises')
export class ListeningExerciseController {
  constructor(private readonly service: ListeningExerciseService) {}

  @Get()
  @ApiOperation({ summary: 'Lấy tất cả exercises' })
  @ApiResponse({ status: 200, description: 'Danh sách exercises', type: [ListeningExercise] })
  getAll(): Promise<ListeningExercise[]> {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy exercise theo ID' })
  @ApiResponse({ status: 200, description: 'Chi tiết exercise', type: ListeningExercise })
  getOne(@Param('id', ParseIntPipe) id: number): Promise<ListeningExercise> {
    return this.service.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Tạo exercise mới' })
  @ApiResponse({ status: 201, description: 'Exercise mới tạo thành công', type: ListeningExercise })
  create(@Body() dto: CreateExerciseDto): Promise<ListeningExercise> {
    return this.service.create(dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Cập nhật exercise' })
  @ApiResponse({ status: 200, description: 'Exercise cập nhật thành công', type: ListeningExercise })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateExerciseDto): Promise<ListeningExercise> {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa exercise (soft delete)' })
  @ApiResponse({ status: 200, description: 'Exercise đã xóa', type: ListeningExercise })
  remove(@Param('id', ParseIntPipe) id: number): Promise<ListeningExercise> {
    return this.service.softDelete(id);
  }
}
