import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service.js';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity.js';
import { ConflictException, NotFoundException } from '@nestjs/common';

describe('UsersService', () => {
  let service: UsersService;
  let repository: any;

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

  const mockUserRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    merge: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get(getRepositoryToken(UserEntity));

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

      mockUserRepository.findOne.mockResolvedValue(null);
      mockUserRepository.create.mockReturnValue(mockUser);
      mockUserRepository.save.mockResolvedValue(mockUser);

      const result = await service.create(createUserDto);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { email: createUserDto.email },
      });
      expect(repository.create).toHaveBeenCalled();
      expect(repository.save).toHaveBeenCalled();
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

      mockUserRepository.findOne.mockResolvedValue(mockUser);

      await expect(service.create(createUserDto)).rejects.toThrow(ConflictException);
      expect(repository.save).not.toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update user fields successfully', async () => {
      const updateUserDto = {
        firstName: 'Johnny',
      };

      mockUserRepository.findOne.mockResolvedValue(mockUser);
      mockUserRepository.merge.mockReturnValue({
        ...mockUser,
        firstName: 'Johnny',
      });
      mockUserRepository.save.mockResolvedValue({
        ...mockUser,
        firstName: 'Johnny',
      });

      const result = await service.update('user-id', updateUserDto);

      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 'user-id' } });
      expect(repository.merge).toHaveBeenCalledWith(mockUser, {
        firstName: 'Johnny',
        password: 'hashed-password',
      });
      expect(repository.save).toHaveBeenCalled();
      expect(result.firstName).toBe('Johnny');
    });

    it('should throw NotFoundException if user is not found', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(service.update('non-existent', { firstName: 'Johnny' })).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
