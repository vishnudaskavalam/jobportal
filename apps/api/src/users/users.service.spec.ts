import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';
import { ConflictException, NotFoundException } from '@nestjs/common';

describe('UsersService', () => {
  let service: UsersService;
  let prisma: PrismaService;

  const mockUser = {
    id: 'user-id',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    phone: '1234567890',
    password: 'hashed-password',
    role: 'USER' as const,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prisma = module.get<PrismaService>(PrismaService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user and hash the password', async () => {
      const createUserDto = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: '1234567890',
        password: 'password123',
      };

      mockPrismaService.user.findUnique.mockResolvedValue(null);
      mockPrismaService.user.create.mockResolvedValue(mockUser);

      const result = await service.create(createUserDto);

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: createUserDto.email },
      });
      expect(prisma.user.create).toHaveBeenCalled();
      expect(result).toEqual(mockUser);
    });

    it('should throw a ConflictException if email is already taken', async () => {
      const createUserDto = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: '1234567890',
        password: 'password123',
      };

      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

      await expect(service.create(createUserDto)).rejects.toThrow(ConflictException);
      expect(prisma.user.create).not.toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update user fields successfully', async () => {
      const updateUserDto = {
        firstName: 'Johnny',
      };

      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      mockPrismaService.user.update.mockResolvedValue({
        ...mockUser,
        firstName: 'Johnny',
      });

      const result = await service.update('user-id', updateUserDto);

      expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { id: 'user-id' } });
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: 'user-id' },
        data: {
          firstName: 'Johnny',
          password: 'hashed-password',
        },
      });
      expect(result.firstName).toBe('Johnny');
    });

    it('should throw NotFoundException if user is not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(service.update('non-existent', { firstName: 'Johnny' })).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
