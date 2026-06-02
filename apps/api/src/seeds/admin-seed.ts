import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { UserEntity } from '../users/entities/user.entity';
import { CategoryEntity } from '../categories/entities/category.entity';
import { UserRole } from '@jobportal/types';

@Injectable()
export class AdminSeed {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
  ) {}


  async seedCategories() {
    const count = await this.categoryRepository.count();
    if (count > 0) return;

    const categories = [
      'Engineering', 'Design', 'Marketing', 'Sales', 'HR', 'Finance', 'DevOps', 'Data Science'
    ];

    for (const name of categories) {
      await this.categoryRepository.save({ name });
    }
    console.log('Initial categories seeded successfully');
  }

  async seedAdmin() {
    const existingAdmin = await this.userRepository.findOne({
      where: {
        email: 'admin@jobportal.com',
      },
    });

    if (existingAdmin) {
      console.log('Admin user already exists');
      return;
    }

    const hashedPassword = await bcrypt.hash(
      'Admin@123',
      10,
    );

    const admin = this.userRepository.create({
      firstName: 'Super',
      lastName: 'Admin',
      email: 'admin@jobportal.com',
      phone: '9999999999',
      password: hashedPassword,
      role: UserRole.ADMIN,
    });

    await this.userRepository.save(admin);

    console.log('Admin user created successfully');
  }
}