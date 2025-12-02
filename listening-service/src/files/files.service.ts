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

  async findAll(skip = 0, take = 20): Promise<File[]> {
    return this.repo.find({
      where: { isDeleted: false },
      order: { createdAt: 'DESC' },
      skip,
      take,
    });
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
      newFile.audioUrl = await this.cloudinary.uploadPdf(audioFile); // audio treated as raw
      newFile.audioDurationSeconds = 0; // hoặc parse duration nếu muốn
      newFile.mimeType = audioFile.mimetype;
    }

    if (imageFile) {
      newFile.imageFilename = imageFile.originalname;
      newFile.imageUrl = await this.cloudinary.uploadImage(imageFile);
      newFile.mimeType = imageFile.mimetype;
    }

    return this.repo.save(newFile);
  }

  // Update audio hoặc image
  async update(
    id: number,
    audioFile?: Express.Multer.File,
    imageFile?: Express.Multer.File,
  ): Promise<File> {
    const file = await this.findOne(id);

    if (audioFile) {
      file.audioFilename = audioFile.originalname;
      file.audioUrl = await this.cloudinary.uploadPdf(audioFile);
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
