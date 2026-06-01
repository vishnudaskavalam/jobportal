import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { UserEntity } from '../users/entities/user.entity';
import { UserRole } from '@jobportal/types';

@Injectable()
export class AdminSeed implements OnModuleInit {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async onModuleInit() {
    await this.seedAdmin();
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