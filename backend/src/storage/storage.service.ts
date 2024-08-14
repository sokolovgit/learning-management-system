import {
  HttpException,
  HttpStatus,
  Injectable,
  OnModuleInit,
} from '@nestjs/common';
import { MinioService } from 'nestjs-minio-client';
import { Readable } from 'stream';
import { ConfigService } from '@nestjs/config';

import * as crypto from 'crypto';

@Injectable()
export class StorageService implements OnModuleInit {
  private readonly minioOptions = {
    endPoint: this.configService.get<string>('minio.endPoint'),
    port: this.configService.get<number>('minio.port'),
    baseBucket: this.configService.get<string>('minio.baseBucket'),
  };

  private get client() {
    return this.minioService.client;
  }

  constructor(
    private readonly minioService: MinioService,
    private readonly configService: ConfigService,
  ) {}

  async onModuleInit() {
    await this.ensureBucketExists();
  }

  private async ensureBucketExists() {
    const client = this.minioService.client;
    const bucketExists = await client.bucketExists(
      this.minioOptions.baseBucket,
    );
    if (!bucketExists) {
      await client.makeBucket(this.minioOptions.baseBucket, 'us-east-1');
    }
  }

  async uploadFile(path: string, file: Express.Multer.File) {
    const hashedFileName = crypto
      .createHash('md5')
      .update(Date.now().toString())
      .digest('hex');

    const metadata = {
      'Content-Type': file.mimetype,
    };

    const minioPath = `${path}/${hashedFileName}.${file.originalname.split('.').pop()}`;

    try {
      await this.client.putObject(
        this.minioOptions.baseBucket,
        minioPath,
        file.buffer,
        file.size,
        metadata,
      );

      return `${this.minioOptions.endPoint}:${this.minioOptions.port}/${this.minioOptions.baseBucket}/${minioPath}`;
    } catch (error) {
      console.error(error);
      throw new HttpException(
        'Error uploading file to storage',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getFile(bucketName: string, fileName: string) {
    const minioClient = this.minioService.client;
    return minioClient.getObject(bucketName, fileName);
  }

  async deleteFile(bucketName: string, fileName: string) {
    const minioClient = this.minioService.client;
    return minioClient.removeObject(bucketName, fileName);
  }
}
