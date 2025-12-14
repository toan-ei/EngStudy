// stats.controller.ts
import { Controller, Get, Query } from '@nestjs/common';
import { StatsService } from './stats.serivce';
import { ApiOperation, ApiTags, ApiQuery, ApiResponse } from '@nestjs/swagger';

@ApiTags('Statistics')
@Controller('stats')
export class StatsController {
  constructor(private stats: StatsService) {}

  // ================================
  // TOPIC
  // ================================
  @Get('topic/total')
  @ApiOperation({ summary: 'Tổng số Topic' })
  @ApiResponse({ status: 200, description: 'Trả về tổng số topic', type: Number })
  getTopicTotal() {
    return this.stats.countTopicTotal();
  }

  @Get('topic/month')
  @ApiOperation({ summary: 'Thống kê Topic theo 12 tháng' })
  @ApiQuery({ name: 'year', required: true, example: 2025 })
  @ApiResponse({
    status: 200,
    description: 'Mảng gồm 12 phần tử, mỗi phần tử là số lượng topic tạo trong tháng đó',
    type: [Number],
  })
  getTopicByMonth(@Query('year') year: number) {
    return this.stats.countTopicByMonth(Number(year));
  }

  // ================================
  // EXERCISE
  // ================================
  @Get('exercise/total')
  @ApiOperation({ summary: 'Tổng số Exercise' })
  @ApiResponse({ status: 200, type: Number })
  getExerciseTotal() {
    return this.stats.countExerciseTotal();
  }

  @Get('exercise/month')
  @ApiOperation({ summary: 'Thống kê Exercise theo 12 tháng' })
  @ApiQuery({ name: 'year', required: true, example: 2025 })
  @ApiResponse({ status: 200, type: [Number] })
  getExerciseByMonth(@Query('year') year: number) {
    return this.stats.countExerciseByMonth(Number(year));
  }

  // ================================
  // QUESTION
  // ================================
  @Get('question/total')
  @ApiOperation({ summary: 'Tổng số Question' })
  @ApiResponse({ status: 200, type: Number })
  getQuestionTotal() {
    return this.stats.countQuestionTotal();
  }

  @Get('question/month')
  @ApiOperation({ summary: 'Thống kê Question theo 12 tháng' })
  @ApiQuery({ name: 'year', required: true, example: 2025 })
  @ApiResponse({ status: 200, type: [Number] })
  getQuestionByMonth(@Query('year') year: number) {
    return this.stats.countQuestionByMonth(Number(year));
  }

  // ================================
  // FILE
  // ================================
  @Get('file/total')
  @ApiOperation({ summary: 'Tổng số File' })
  @ApiResponse({ status: 200, type: Number })
  getFileTotal() {
    return this.stats.countFileTotal();
  }

  @Get('file/month')
  @ApiOperation({ summary: 'Thống kê File theo 12 tháng' })
  @ApiQuery({ name: 'year', required: true, example: 2025 })
  @ApiResponse({ status: 200, type: [Number] })
  getFileByMonth(@Query('year') year: number) {
    return this.stats.countFileByMonth(Number(year));
  }
}
