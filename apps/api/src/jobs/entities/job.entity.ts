import { CategoryEntity } from '../../categories/entities/category.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';

export enum JobType {
  FULL_TIME = 'FULL_TIME',
  PART_TIME = 'PART_TIME',
  CONTRACT = 'CONTRACT',
  INTERNSHIP = 'INTERNSHIP',
}

export interface JobApplication {
  userId: string;
  status: 'APPLIED' | 'REVIEWING' | 'SHORTLISTED' | 'REJECTED' | 'HIRED';
  appliedAt: Date;
  user?: {
    id: string;
    name: string;
    email: string;
  } | null;
}

@Entity('jobs')
export class JobEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  company: string;

  @Column({ nullable: true })
  yearsOfExperience: string;

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

  @ManyToOne(() => CategoryEntity)
  category: CategoryEntity;

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
