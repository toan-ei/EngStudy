import { Module } from '@nestjs/common';
import { CloudinaryConfig } from './cloudinary.config';
import { CloudinaryService } from './cloudinary.service';

@Module({
  providers: [CloudinaryService],
  exports: [CloudinaryService], 
})
export class CloudinaryModule {
  constructor() {
    CloudinaryConfig(); // cấu hình khi khởi tạo module
  }
}
