import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserEntity } from '../users/entities/user.entity';
import { CategoryEntity } from '../categories/entities/category.entity';
import { AdminSeed } from './admin-seed';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, CategoryEntity]),
  ],
  providers: [AdminSeed],
})
export class SeedModule {}