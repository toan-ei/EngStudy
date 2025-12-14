import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions } from 'typeorm';
import { File } from './file.entity';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(File)
    private repo: Repository<File>,
    private cloudinary: CloudinaryService,
  ) {}

 async findAllPaged(page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [data, total] = await this.repo.findAndCount({
      where: { isDeleted: false },
      order: { createdAt: 'DESC' },
      skip,
      take: limit,
    });

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: number): Promise<File> {
    const file = await this.repo.findOne({ where: { fileId: id, isDeleted: false } });
    if (!file) throw new NotFoundException(`File ${id} not found`);
    return file;
  }

  // Upload audio + image cùng lúc
  async upload(audioFile?: Express.Multer.File, imageFile?: Express.Multer.File): Promise<File> {
    const newFile = this.repo.create();

    if (audioFile) {
      newFile.audioFilename = audioFile.originalname;
      newFile.audioUrl = await this.cloudinary.uploadAudio(audioFile);
      newFile.audioDurationSeconds = 0;
      newFile.mimeType = audioFile.mimetype;
    }

    if (imageFile) {
      newFile.imageFilename = imageFile.originalname;
      newFile.imageUrl = await this.cloudinary.uploadImage(imageFile);
      newFile.mimeType = imageFile.mimetype;
    }

    return this.repo.save(newFile);
  }

  async update(
    id: number,
    audioFile?: Express.Multer.File,
    imageFile?: Express.Multer.File,
  ): Promise<File> {
    const file = await this.findOne(id);

    if (audioFile) {
      file.audioFilename = audioFile.originalname;
      file.audioUrl = await this.cloudinary.uploadAudio(audioFile);
      file.audioDurationSeconds = 0;
      file.mimeType = audioFile.mimetype;
    }

    if (imageFile) {
      file.imageFilename = imageFile.originalname;
      file.imageUrl = await this.cloudinary.uploadImage(imageFile);
      file.mimeType = imageFile.mimetype;
    }

    return this.repo.save(file);
  }

  async softDelete(id: number): Promise<File> {
    const file = await this.findOne(id);
    file.isDeleted = true;
    return this.repo.save(file);
  }
}
