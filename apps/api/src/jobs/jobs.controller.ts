import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { RolesGuard } from 'src/auth/guard/role.guard';
import { UserRole } from '@jobportal/types';
import { Roles } from 'src/auth/decorators/roel.decorator';
import { PaginationDto } from './dto/pagination-dato';
import { CurrentUser } from '../auth/decorators/user.decorator';

@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  create(@Body() createJobDto: CreateJobDto) {
    return this.jobsService.create(createJobDto);
  }

  @Get()
    @Post()
  @UseGuards(AuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
findAll(
  @Query() query: PaginationDto,
) {
  return this.jobsService.findAll(
    Number(query.page),
    Number(query.limit),
    query.category,
    query.search,
    query.location,
    query.posted,
  );
  }

  @Get('count')
  @UseGuards(AuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
  count() {
    return this.jobsService.count();
  }
  @Get('/list')
    @Post()
jobList(
  @Query() query: PaginationDto,
) {
  return this.jobsService.findAll(
    Number(query.page),
    Number(query.limit),
    query.category,
    query.search,
    query.location,
    query.posted,
  );
}

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.jobsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  update(@Param('id') id: string, @Body() updateJobDto: UpdateJobDto) {
    return this.jobsService.update(id, updateJobDto);
  }

  @Post(':id/apply')
  @UseGuards(AuthGuard)
  apply(@Param('id') id: string, @CurrentUser() user: any) {    
    return this.jobsService.apply(id, user.sub);
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.jobsService.remove(id);
  }

  @Get('featured')
  findFeatured() {
    return this.jobsService.findFeatured();
  }
}
