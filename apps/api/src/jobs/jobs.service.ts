import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { JobApplication, JobEntity } from './entities/job.entity';
import { Repository, In, Not } from 'typeorm';
import { UserEntity } from '../users/entities/user.entity';

@Injectable()
export class JobsService {
   constructor(
    @InjectRepository(JobEntity)
    private readonly jobsRepository: Repository<JobEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  create(data: any) {
    const { categoryId, ...rest } = data;
    return this.jobsRepository.save({
      ...rest,
      category: { id: categoryId },
    });
  }


  async findAll(
  page = 1,
  limit = 10,
  category?: string,
  search?: string,
  location?: string,
  posted?: string,
) {
  const queryBuilder =
    this.jobsRepository.createQueryBuilder('job')
    .leftJoinAndSelect('job.category', 'category');

  queryBuilder.where('job.JobStatus != :deletedStatus', { deletedStatus: 'DELETED' });

  if (category) {
    queryBuilder.andWhere(
      'category.id = :category',
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

  if (location) {
    queryBuilder.andWhere(
      'LOWER(job.location) LIKE LOWER(:location)',
      { location: `%${location}%` },
    );
  }

  if (posted) {
    const now = new Date();
    let dateLimit;
    switch(posted) {
      case '24h':
        dateLimit = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case '1w':
        dateLimit = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '1m':
        dateLimit = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
    }
    if (dateLimit) {
      queryBuilder.andWhere('job.createdAt >= :dateLimit', { dateLimit });
    }
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

  async findOne(id: string) {
    const job = await this.jobsRepository.findOne({
      where: { id },
      relations: ['category'],
    });
    
    if (job && job.applications && job.applications.length > 0) {
      const userIds = job.applications.map((app: any) => app.userId);
      const users = await this.userRepository.find({
        where: { id: In(userIds) },
        select: ['id', 'firstName', 'lastName', 'email'],
      });
      const userMap = new Map(users.map(u => [u.id, u]));
      
      job.applications = job.applications.map((app: any) => {
        const user = userMap.get(app.userId);
        return {
          ...app,
          user: user ? {
            id: user.id,
            name: `${user.firstName} ${user.lastName}`.trim(),
            email: user.email
          } : null,
        };
      });
    }
    
    return job;
  }

   async update(
    id: string,
    data: any,
  ) {
    const { categoryId, ...rest } = data;
    const updateData: any = { ...rest };
    if (categoryId) {
      updateData.category = { id: categoryId };
    }
    await this.jobsRepository.update(id, updateData);
    return this.findOne(id);
  }

  async remove(id: string) {
    await this.jobsRepository.update(id, { JobStatus: 'DELETED' });
    return { success: true, message: 'Job successfully deleted' };
  }
  async apply(
    jobId: string,
    userId: string,
  ) {
    console.log(userId);
    
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
console.log(job.applications), userId;
    return this.jobsRepository.save(job);
  }

  findFeatured() {
    return this.jobsRepository.find({
      where: {
        isFeatured: true,
        JobStatus: Not('DELETED'),
      },
      relations: ['category'],
      order: {
        createdAt: 'DESC',
      },
    });
  }
  count() {
    return this.jobsRepository.count({where : {
      JobStatus : 'OPEN'}});
  }
}
