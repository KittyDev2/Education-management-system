import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';

@Injectable()
export class SubjectsService {
  constructor(private prisma: PrismaService) {}

  async create(createSubjectDto: CreateSubjectDto) {
    const existingSubject = await this.prisma.subject.findUnique({
      where: { name: createSubjectDto.name },
    });

    if (existingSubject) {
      throw new ConflictException('Subject with this name already exists');
    }

    return this.prisma.subject.create({
      data: createSubjectDto,
    });
  }

  async findAll() {
    return this.prisma.subject.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string) {
    const subject = await this.prisma.subject.findUnique({
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
            classroom: true,
          },
        },
      },
    });

    if (!subject) {
      throw new NotFoundException('Subject not found');
    }

    return subject;
  }

  async update(id: string, updateSubjectDto: UpdateSubjectDto) {
    const subject = await this.prisma.subject.findUnique({ where: { id } });
    if (!subject) {
      throw new NotFoundException('Subject not found');
    }

    if (updateSubjectDto.name && updateSubjectDto.name !== subject.name) {
      const existingSubject = await this.prisma.subject.findUnique({
        where: { name: updateSubjectDto.name },
      });
      if (existingSubject) {
        throw new ConflictException('Subject with this name already exists');
      }
    }

    return this.prisma.subject.update({
      where: { id },
      data: updateSubjectDto,
    });
  }

  async remove(id: string) {
    const subject = await this.prisma.subject.findUnique({
      where: { id },
      include: { classes: true },
    });

    if (!subject) {
      throw new NotFoundException('Subject not found');
    }

    if (subject.classes.length > 0) {
      // Soft delete - just mark as inactive
      return this.prisma.subject.update({
        where: { id },
        data: { isActive: false },
      });
    }

    return this.prisma.subject.delete({ where: { id } });
  }
}