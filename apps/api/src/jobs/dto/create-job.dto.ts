import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

import { JobType } from '../entities/job.entity';


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

  @IsString()
  @IsNotEmpty()
  categoryId: string;

  @IsOptional()
  @IsString()
  logoColor?: string;

  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;
}