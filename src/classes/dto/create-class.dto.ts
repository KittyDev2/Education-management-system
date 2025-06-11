import { IsNotEmpty, IsString, IsOptional, IsDateString, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ClassStatus } from '@prisma/client';

export class CreateClassDto {
  @ApiProperty({ example: 'Advanced Mathematics' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Calculus and derivatives', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: '2024-01-15T09:00:00Z' })
  @IsDateString()
  @IsNotEmpty()
  startTime: Date;

  @ApiProperty({ example: '2024-01-15T10:30:00Z' })
  @IsDateString()
  @IsNotEmpty()
  endTime: Date;

  @ApiProperty({ example: 'clw123456789' })
  @IsString()
  @IsNotEmpty()
  teacherId: string;

  @ApiProperty({ example: 'clw123456789' })
  @IsString()
  @IsNotEmpty()
  subjectId: string;

  @ApiProperty({ example: 'clw123456789' })
  @IsString()
  @IsNotEmpty()
  classroomId: string;

  @ApiProperty({ enum: ClassStatus, example: ClassStatus.SCHEDULED, required: false })
  @IsEnum(ClassStatus)
  @IsOptional()
  status?: ClassStatus;
}