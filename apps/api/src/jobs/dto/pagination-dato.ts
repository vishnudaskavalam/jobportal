
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
  category?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  posted?: string;

  @IsOptional()
  @IsString()
  yearsOfExperience?: string;
}