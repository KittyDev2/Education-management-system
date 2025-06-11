import { Injectable, ConflictException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';
import { Role, ClassStatus } from '@prisma/client';

@Injectable()
export class ClassesService {
  constructor(private prisma: PrismaService) {}

  async create(createClassDto: CreateClassDto, userId: string, userRole: Role) {
    // Check if classroom is available at the specified time
    const conflictingClass = await this.prisma.class.findFirst({
      where: {
        classroomId: createClassDto.classroomId,
        status: { not: ClassStatus.CANCELLED },
        OR: [
          {
            AND: [
              { startTime: { lte: createClassDto.startTime } },
              { endTime: { gt: createClassDto.startTime } },
            ],
          },
          {
            AND: [
              { startTime: { lt: createClassDto.endTime } },
              { endTime: { gte: createClassDto.endTime } },
            ],
          },
          {
            AND: [
              { startTime: { gte: createClassDto.startTime } },
              { endTime: { lte: createClassDto.endTime } },
            ],
          },
        ],
      },
    });

    if (conflictingClass) {
      throw new ConflictException('Classroom is not available at the specified time');
    }

    // Teachers can only schedule classes for themselves
    if (userRole === Role.TEACHER && createClassDto.teacherId !== userId) {
      throw new ForbiddenException('Teachers can only schedule classes for themselves');
    }

    return this.prisma.class.create({
      data: {
        ...createClassDto,
        createdById: userId,
      },
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
        classroom: true,
        createdBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });
  }

  async findAll(userId?: string, userRole?: Role) {
    const whereClause = userRole === Role.TEACHER ? { teacherId: userId } : {};

    return this.prisma.class.findMany({
      where: whereClause,
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
        classroom: true,
        createdBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
      orderBy: { startTime: 'asc' },
    });
  }

  async findOne(id: string, userId?: string, userRole?: Role) {
    const classItem = await this.prisma.class.findUnique({
      where: { id },
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
        classroom: true,
        createdBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    if (!classItem) {
      throw new NotFoundException('Class not found');
    }

    // Teachers can only view their own classes
    if (userRole === Role.TEACHER && classItem.teacherId !== userId) {
      throw new ForbiddenException('Teachers can only view their own classes');
    }

    return classItem;
  }

  async update(id: string, updateClassDto: UpdateClassDto, userId: string, userRole: Role) {
    const existingClass = await this.prisma.class.findUnique({
      where: { id },
    });

    if (!existingClass) {
      throw new NotFoundException('Class not found');
    }

    // Teachers can only update their own classes
    if (userRole === Role.TEACHER && existingClass.teacherId !== userId) {
      throw new ForbiddenException('Teachers can only update their own classes');
    }

    // Check for classroom conflicts if updating time or classroom
    if (updateClassDto.startTime || updateClassDto.endTime || updateClassDto.classroomId) {
      const startTime = updateClassDto.startTime || existingClass.startTime;
      const endTime = updateClassDto.endTime || existingClass.endTime;
      const classroomId = updateClassDto.classroomId || existingClass.classroomId;

      const conflictingClass = await this.prisma.class.findFirst({
        where: {
          id: { not: id },
          classroomId,
          status: { not: ClassStatus.CANCELLED },
          OR: [
            {
              AND: [
                { startTime: { lte: startTime } },
                { endTime: { gt: startTime } },
              ],
            },
            {
              AND: [
                { startTime: { lt: endTime } },
                { endTime: { gte: endTime } },
              ],
            },
            {
              AND: [
                { startTime: { gte: startTime } },
                { endTime: { lte: endTime } },
              ],
            },
          ],
        },
      });

      if (conflictingClass) {
        throw new ConflictException('Classroom is not available at the specified time');
      }
    }

    // Teachers cannot change the teacher assignment
    if (userRole === Role.TEACHER && updateClassDto.teacherId && updateClassDto.teacherId !== userId) {
      throw new ForbiddenException('Teachers cannot assign classes to other teachers');
    }

    return this.prisma.class.update({
      where: { id },
      data: updateClassDto,
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
        classroom: true,
        createdBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });
  }

  async remove(id: string, userId: string, userRole: Role) {
    const existingClass = await this.prisma.class.findUnique({
      where: { id },
    });

    if (!existingClass) {
      throw new NotFoundException('Class not found');
    }

    // Teachers can only delete their own classes
    if (userRole === Role.TEACHER && existingClass.teacherId !== userId) {
      throw new ForbiddenException('Teachers can only delete their own classes');
    }

    return this.prisma.class.delete({ where: { id } });
  }

  async findByTeacher(teacherId: string) {
    return this.prisma.class.findMany({
      where: { teacherId },
      include: {
        subject: true,
        classroom: true,
      },
      orderBy: { startTime: 'asc' },
    });
  }

  async findByClassroom(classroomId: string) {
    return this.prisma.class.findMany({
      where: { classroomId },
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
      orderBy: { startTime: 'asc' },
    });
  }

  async findByDateRange(startDate: Date, endDate: Date) {
    return this.prisma.class.findMany({
      where: {
        startTime: { gte: startDate },
        endTime: { lte: endDate },
      },
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
        classroom: true,
      },
      orderBy: { startTime: 'asc' },
    });
  }
}