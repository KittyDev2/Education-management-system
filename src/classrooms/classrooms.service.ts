import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateClassroomDto } from './dto/create-classroom.dto';
import { UpdateClassroomDto } from './dto/update-classroom.dto';

@Injectable()
export class ClassroomsService {
  constructor(private prisma: PrismaService) {}

  async create(createClassroomDto: CreateClassroomDto) {
    const existingClassroom = await this.prisma.classroom.findUnique({
      where: { name: createClassroomDto.name },
    });

    if (existingClassroom) {
      throw new ConflictException('Classroom with this name already exists');
    }

    return this.prisma.classroom.create({
      data: createClassroomDto,
    });
  }

  async findAll() {
    return this.prisma.classroom.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string) {
    const classroom = await this.prisma.classroom.findUnique({
      where: { id },
      include: {
        classes: {
          include: {
            teacher: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
              },
            },
            subject: true,
          },
        },
      },
    });

    if (!classroom) {
      throw new NotFoundException('Classroom not found');
    }

    return classroom;
  }

  async update(id: string, updateClassroomDto: UpdateClassroomDto) {
    const classroom = await this.prisma.classroom.findUnique({ where: { id } });
    if (!classroom) {
      throw new NotFoundException('Classroom not found');
    }

    if (updateClassroomDto.name && updateClassroomDto.name !== classroom.name) {
      const existingClassroom = await this.prisma.classroom.findUnique({
        where: { name: updateClassroomDto.name },
      });
      if (existingClassroom) {
        throw new ConflictException('Classroom with this name already exists');
      }
    }

    return this.prisma.classroom.update({
      where: { id },
      data: updateClassroomDto,
    });
  }

  async remove(id: string) {
    const classroom = await this.prisma.classroom.findUnique({
      where: { id },
      include: { classes: true },
    });

    if (!classroom) {
      throw new NotFoundException('Classroom not found');
    }

    if (classroom.classes.length > 0) {
      // Soft delete - just mark as inactive
      return this.prisma.classroom.update({
        where: { id },
        data: { isActive: false },
      });
    }

    return this.prisma.classroom.delete({ where: { id } });
  }
}