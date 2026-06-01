import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { JobApplication, JobEntity } from './entities/job.entity';
import { Repository } from 'typeorm';

@Injectable()
export class JobsService {
   constructor(
    @InjectRepository(JobEntity)
    private readonly jobsRepository: Repository<JobEntity>,
  ) {}

  create(data: any) {
    return this.jobsRepository.save(data);
  }


  async findAll(
  page = 1,
  limit = 10,
  category?: string,
  search?: string,
) {
  const queryBuilder =
    this.jobsRepository.createQueryBuilder('job');

  if (category) {
    queryBuilder.andWhere(
      'job.category = :category',
      { category },
    );
  }

  if (search) {
    queryBuilder.andWhere(
      `
      (
        LOWER(job.title) LIKE LOWER(:search)
        OR LOWER(job.company) LIKE LOWER(:search)
        OR LOWER(job.location) LIKE LOWER(:search)
      )
      `,
      {
        search: `%${search}%`,
      },
    );
  }

  const [jobs, total] =
    await queryBuilder
      .orderBy('job.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

  return {
    data: jobs,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(
        total / limit,
      ),
      hasNextPage:
        page < Math.ceil(total / limit),
      hasPreviousPage: page > 1,
    },
  };
}

  findOne(id: string) {
    return this.jobsRepository.findOne({
      where: { id },
    });
  }

   async update(
    id: string,
    data: any,
  ) {
    await this.jobsRepository.update(id, data);
    return this.findOne(id);
  }

  async remove(id: string) {
    return this.jobsRepository.delete(id);
  }
  async apply(
    jobId: string,
    userId: string,
  ) {
    const job =
      await this.jobsRepository.findOne({
        where: { id: jobId },
      });

    if (!job) {
      throw new NotFoundException(
        'Job not found',
      );
    }

    const alreadyApplied =
      job.applications?.find(
        (a) => a.userId === userId,
      );

    if (alreadyApplied) {
      throw new BadRequestException(
        'Already applied',
      );
    }

    const application: JobApplication = {
      userId,
      status: 'APPLIED',
      appliedAt: new Date(),
    };

    job.applications = [
      ...(job.applications || []),
      application,
    ];

    return this.jobsRepository.save(job);
  }

  findFeatured() {
  return this.jobsRepository.find({
    where: {
      isFeatured: true,
    },
  });
  }
  count() {
    return this.jobsRepository.count({where : {
      JobStatus : 'OPEN'}});
  }
}
