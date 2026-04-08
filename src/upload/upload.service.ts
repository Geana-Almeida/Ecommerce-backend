import { Injectable } from '@nestjs/common';
import ImageKit from 'imagekit';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UploadService {
  private imagekit: ImageKit;

  constructor(private configService: ConfigService) {
    this.imagekit = new ImageKit({
      publicKey: this.configService.get<string>('IMAGEKIT_PUBLIC_KEY')!,
      privateKey: this.configService.get<string>('IMAGEKIT_PRIVATE_KEY')!,
      urlEndpoint: this.configService.get<string>('IMAGEKIT_URL_ENDPOINT')!,
    });
  }

  async uploadFile(file: Express.Multer.File) {
    const response = await this.imagekit.upload({
      file: file.buffer,
      fileName: file.originalname,
      folder: '/ecommerce-hortifruti'
    });

    return response.url;
  }
}