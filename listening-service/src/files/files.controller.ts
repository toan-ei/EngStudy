import { Controller, Get, Post, Delete, Param, Query, UploadedFile, UseInterceptors, Body, ParseIntPipe, Put, UploadedFiles } from '@nestjs/common';
import { FilesService } from './files.service';
import { FileResponseDto } from './dto/file-response.dto';
import { UploadFileDto } from './dto/upload-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { AnyFilesInterceptor, FileFieldsInterceptor, FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiConsumes, ApiBody, ApiQuery } from '@nestjs/swagger';
import { File } from './file.entity';

@ApiTags('Files')
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

 @Get()
  @ApiOperation({ summary: 'Lấy tất cả file (có phân trang)' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  async findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '20',
  ) {
    return this.filesService.findAllPaged(Number(page), Number(limit));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy file theo ID' })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<File> {
    return this.filesService.findOne(id);
  }

 @Post()
  @ApiOperation({ summary: 'Upload audio + image' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UploadFileDto })
  @UseInterceptors(AnyFilesInterceptor())
  async upload(@UploadedFiles() files: Express.Multer.File[]): Promise<FileResponseDto> {
    const audioFile = files.find(f => f.fieldname === 'audio');
    const imageFile = files.find(f => f.fieldname === 'image');
    return this.filesService.upload(audioFile, imageFile);
  }

 @Put(':id')
  @ApiOperation({ summary: 'Update audio hoặc image' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UpdateFileDto })
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'audio', maxCount: 1 },
      { name: 'image', maxCount: 1 },
    ]),
  )
  async update(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFiles()
    files: {
      audio?: Express.Multer.File[];
      image?: Express.Multer.File[];
    },
  ): Promise<File> {
    const audioFile = files.audio?.[0];
    const imageFile = files.image?.[0];

    return this.filesService.update(id, audioFile, imageFile);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Soft delete file' })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<File> {
    return this.filesService.softDelete(id);
  }
}