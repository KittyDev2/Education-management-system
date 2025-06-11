import { IsString, IsOptional, IsDateString, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ClassStatus } from '@prisma/client';

export class UpdateClassDto {
  @ApiProperty({ example: 'Updated Mathematics', required: false })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({ example: 'Updated description', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: '2024-01-15T09:00:00Z', required: false })
  @IsDateString()
  @IsOptional()
  startTime?: Date;

  @ApiProperty({ example: '2024-01-15T10:30:00Z', required: false })
  @IsDateString()
  @IsOptional()
  endTime?: Date;

  @ApiProperty({ example: 'clw123456789', required: false })
  @IsString()
  @IsOptional()
  teacherId?: string;

  @ApiProperty({ example: 'clw123456789', required: false })
  @IsString()
  @IsOptional()
  subjectId?: string;

  @ApiProperty({ example: 'clw123456789', required: false })
  @IsString()
  @IsOptional()
  classroomId?: string;

  @ApiProperty({ enum: ClassStatus, example: ClassStatus.COMPLETED, required: false })
  @IsEnum(ClassStatus)
  @IsOptional()
  status?: ClassStatus;
}