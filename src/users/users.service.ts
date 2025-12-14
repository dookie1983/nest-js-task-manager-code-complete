import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { prisma } from 'src/prisma.client';

@Injectable()
export class UsersService {
  async create(createUserDto: CreateUserDto) {
    try {
      await prisma.user.create({
        data: {
          name: createUserDto.name,
          email: createUserDto.email,
          year_of_birth: createUserDto.year_of_birth,
        },
      });
      return 'This action adds a new user';
    } catch (error) {
      throw new BadRequestException('Cannot create user')
    }
  }

  async findAll() {
    return await prisma.user.findMany();
  }

  async findAllByTeenAgers() {
    return await prisma.user.findMany({
      where: {
        year_of_birth: {
          gte: 2000,
          lte: 2005,
        },
      },
    });
  }

  async findOneByEmail(email: string) {
    return await prisma.user.findUnique({
      where: { email: email }
    });
  }

  async findOne(id: number) {
    const user = await prisma.user.findUnique({
      where: { id: id }
    });
    if (user) {
      return user;
    }
    throw new NotFoundException('User not found')
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    return await prisma.user.update({
      where: { id: id },
      data: {
        name: updateUserDto.name,
        email: updateUserDto.email,
        year_of_birth: updateUserDto.year_of_birth,
      }
    });
  }

  async remove(id: number) {
    return await prisma.user.delete({
      where: { id: id }
    });
  }
}
