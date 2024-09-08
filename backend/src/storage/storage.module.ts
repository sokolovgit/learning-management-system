import { Module } from '@nestjs/common';
import { MinioModule } from 'nestjs-minio-client';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { StorageService } from './storage.service';

@Module({
  imports: [
    ConfigModule,
    MinioModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          endPoint: configService.get<string>('minio.endPoint'),
          port: configService.get<number>('minio.port'),
          useSSL: configService.get<boolean>('minio.useSSL'),
          accessKey: configService.get<string>('minio.accessKey'),
          secretKey: configService.get<string>('minio.secretKey'),
        };
      },
    }),
  ],
  providers: [StorageService],
  exports: [StorageService, MinioModule],
})
export class StorageModule {}
