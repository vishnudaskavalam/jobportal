import {
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator';

import { JobType } from '../entities/job.entity';
import { JobCategory } from '@jobportal/types';

export class CreateJobDto {
  @IsString()
  title: string;

  @IsString()
  company: string;

  @IsString()
  location: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  salary: string;

  @IsEnum(JobType)
  type: JobType;

  @IsEnum(JobCategory)
  category: JobCategory;

  @IsOptional()
  @IsString()
  logoColor?: string;

  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;
}