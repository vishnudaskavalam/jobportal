import { JobCategory } from '@jobportal/types';
import {
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';

export class PaginationDto {
  @IsOptional()
  @IsNumberString()
  page?: string = '1';

  @IsOptional()
  @IsNumberString()
  limit?: string = '10';

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  category?: JobCategory;
}