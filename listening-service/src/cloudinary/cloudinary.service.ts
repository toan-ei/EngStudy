import { Injectable } from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import * as streamifier from 'streamifier';

@Injectable()
export class CloudinaryService {
  async uploadImage(file: Express.Multer.File): Promise<string> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'listening', resource_type: 'image' },
        (error, result?: UploadApiResponse) => {
          if (error) return reject(error);
          if (!result)
            return reject(new Error('No result returned from Cloudinary.'));
          resolve(result.secure_url);
        },
      );

      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }

  async uploadMultiple(files: Express.Multer.File[]): Promise<string[]> {
    if (!files?.length) return [];

    const uploadPromises = files.map((file) => this.uploadImage(file));
    return Promise.all(uploadPromises);
  }

  // ⚡ Upload AUDIO (.m4a, .mp3, .wav,...)
  async uploadAudio(file: Express.Multer.File): Promise<string> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'audio',
          resource_type: 'video', // Cloudinary yêu cầu thế này để xử lý audio
        },
        (error, result?: UploadApiResponse) => {
          if (error) return reject(error);
          if (!result)
            return reject(new Error('No result returned from Cloudinary.'));
          resolve(result.secure_url);
        },
      );

      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }
}
