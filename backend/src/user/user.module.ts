import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './entities/user.entity';
import { StorageService } from '../storage/storage.service';
import { StorageModule } from '../storage/storage.module';
import { AbilitiesModule } from '../abilities/abilities.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), StorageModule, AbilitiesModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
