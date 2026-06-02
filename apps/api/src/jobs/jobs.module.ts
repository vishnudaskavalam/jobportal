import { Module } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { JobsController } from './jobs.controller';
import { AuthModule } from '../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobEntity } from './entities/job.entity';
import { UserEntity } from '../users/entities/user.entity';

@Module({
  imports: [AuthModule,TypeOrmModule.forFeature([JobEntity, UserEntity])],
  controllers: [JobsController],
  providers: [JobsService],
})
export class JobsModule { }
