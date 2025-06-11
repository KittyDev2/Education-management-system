import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { ClassroomsService } from './classrooms.service';
import { CreateClassroomDto } from './dto/create-classroom.dto';
import { UpdateClassroomDto } from './dto/update-classroom.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Classrooms')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('classrooms')
export class ClassroomsController {
  constructor(private readonly classroomsService: ClassroomsService) {}

  @ApiOperation({ summary: 'Create a new classroom (Directors/Vice-Directors only)' })
  @ApiResponse({ status: 201, description: 'Classroom created successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden - insufficient permissions' })
  @UseGuards(RolesGuard)
  @Roles(Role.DIRECTOR, Role.VICE_DIRECTOR)
  @Post()
  create(@Body() createClassroomDto: CreateClassroomDto) {
    return this.classroomsService.create(createClassroomDto);
  }

  @ApiOperation({ summary: 'Get all classrooms' })
  @ApiResponse({ status: 200, description: 'Classrooms retrieved successfully' })
  @Get()
  findAll() {
    return this.classroomsService.findAll();
  }

  @ApiOperation({ summary: 'Get classroom by ID' })
  @ApiResponse({ status: 200, description: 'Classroom retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Classroom not found' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.classroomsService.findOne(id);
  }

  @ApiOperation({ summary: 'Update classroom (Directors/Vice-Directors only)' })
  @ApiResponse({ status: 200, description: 'Classroom updated successfully' })
  @ApiResponse({ status: 404, description: 'Classroom not found' })
  @ApiResponse({ status: 403, description: 'Forbidden - insufficient permissions' })
  @UseGuards(RolesGuard)
  @Roles(Role.DIRECTOR, Role.VICE_DIRECTOR)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateClassroomDto: UpdateClassroomDto) {
    return this.classroomsService.update(id, updateClassroomDto);
  }

  @ApiOperation({ summary: 'Delete classroom (Directors only)' })
  @ApiResponse({ status: 200, description: 'Classroom deleted successfully' })
  @ApiResponse({ status: 404, description: 'Classroom not found' })
  @ApiResponse({ status: 403, description: 'Forbidden - insufficient permissions' })
  @UseGuards(RolesGuard)
  @Roles(Role.DIRECTOR)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.classroomsService.remove(id);
  }
}