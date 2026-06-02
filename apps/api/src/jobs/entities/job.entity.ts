import { JobCategory } from '@jobportal/types';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum JobType {
  FULL_TIME = 'FULL_TIME',
  PART_TIME = 'PART_TIME',
  CONTRACT = 'CONTRACT',
  INTERNSHIP = 'INTERNSHIP',
}

export interface JobApplication {
  userId: string;
  status:
    | 'APPLIED'
    | 'REVIEWING'
    | 'SHORTLISTED'
    | 'REJECTED'
    | 'HIRED';
  appliedAt: Date;
}



@Entity('jobs')
export class JobEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  company: string;

  @Column()
  location: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ nullable: true })
  salary: string;

  @Column({
    type: 'enum',
    enum: JobType,
    default: JobType.FULL_TIME,
  })
  type: JobType;

  @Column({
    type: 'enum',
    enum: JobCategory,
    default: JobCategory.ENGINEERING,
  })
  category: JobCategory;

  @Column({
    type: 'enum',
    enum: ['OPEN', 'CLOSED', 'DELETED'],
    default: 'OPEN',
  })
  JobStatus: 'OPEN' | 'CLOSED' | 'DELETED';

  @Column({
    default: false,
  })
  isFeatured: boolean;

  @Column({
    nullable: true,
  })
  logoColor: string;

  @Column({
    type: 'jsonb',
    default: [],
  })
  applications: JobApplication[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}