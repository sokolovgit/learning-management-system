import { Injectable } from '@nestjs/common';
import { MinioService } from 'nestjs-minio-client';
import { Readable } from 'stream';

@Injectable()
export class StorageService {
  constructor(private readonly minioService: MinioService) {}

  private get client() {
    return this.minioService.client;
  }

  async uploadFile(bucketName: string, fileName: string, fileStream: Readable) {
    const minioClient = this.minioService.client;
    return minioClient.putObject(bucketName, fileName, fileStream);
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
