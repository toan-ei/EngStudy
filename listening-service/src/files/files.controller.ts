import { Controller, Get, Post, Delete, Param, Query, UploadedFile, UseInterceptors, Body, ParseIntPipe, Put, UploadedFiles } from '@nestjs/common';
import { FilesService } from './files.service';
import { FileResponseDto } from './dto/file-response.dto';
import { UploadFileDto } from './dto/upload-file.dto';
import { AnyFilesInterceptor, FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { File } from './file.entity';

@ApiTags('Files')
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Get()
  @ApiOperation({ summary: 'Lấy tất cả file' })
  async findAll(): Promise<File[]> {
    return this.filesService.findAll();
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
  @UseInterceptors(FileInterceptor('audio'), FileInterceptor('image'))
  async update(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile('audio') audioFile?: Express.Multer.File,
    @UploadedFile('image') imageFile?: Express.Multer.File,
  ): Promise<File> {
    return this.filesService.update(id, audioFile, imageFile);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Soft delete file' })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<File> {
    return this.filesService.softDelete(id);
  }
}