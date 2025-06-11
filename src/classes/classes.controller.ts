import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { ClassesService } from './classes.service';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Classes')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('classes')
export class ClassesController {
  constructor(private readonly classesService: ClassesService) {}

  @ApiOperation({ summary: 'Create a new class' })
  @ApiResponse({ status: 201, description: 'Class created successfully' })
  @ApiResponse({ status: 409, description: 'Classroom conflict' })
  @Post()
  create(@Body() createClassDto: CreateClassDto, @Request() req) {
    return this.classesService.create(createClassDto, req.user.id, req.user.role);
  }

  @ApiOperation({ summary: 'Get all classes' })
  @ApiResponse({ status: 200, description: 'Classes retrieved successfully' })
  @Get()
  findAll(@Request() req) {
    return this.classesService.findAll(req.user.id, req.user.role);
  }

  @ApiOperation({ summary: 'Get class by ID' })
  @ApiResponse({ status: 200, description: 'Class retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Class not found' })
  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    return this.classesService.findOne(id, req.user.id, req.user.role);
  }

  @ApiOperation({ summary: 'Update class' })
  @ApiResponse({ status: 200, description: 'Class updated successfully' })
  @ApiResponse({ status: 404, description: 'Class not found' })
  @ApiResponse({ status: 409, description: 'Classroom conflict' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateClassDto: UpdateClassDto, @Request() req) {
    return this.classesService.update(id, updateClassDto, req.user.id, req.user.role);
  }

  @ApiOperation({ summary: 'Delete class' })
  @ApiResponse({ status: 200, description: 'Class deleted successfully' })
  @ApiResponse({ status: 404, description: 'Class not found' })
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.classesService.remove(id, req.user.id, req.user.role);
  }

  @ApiOperation({ summary: 'Get classes by teacher' })
  @ApiResponse({ status: 200, description: 'Classes retrieved successfully' })
  @UseGuards(RolesGuard)
  @Roles(Role.DIRECTOR, Role.VICE_DIRECTOR)
  @Get('teacher/:teacherId')
  findByTeacher(@Param('teacherId') teacherId: string) {
    return this.classesService.findByTeacher(teacherId);
  }

  @ApiOperation({ summary: 'Get classes by classroom' })
  @ApiResponse({ status: 200, description: 'Classes retrieved successfully' })
  @Get('classroom/:classroomId')
  findByClassroom(@Param('classroomId') classroomId: string) {
    return this.classesService.findByClassroom(classroomId);
  }

  @ApiOperation({ summary: 'Get classes by date range' })
  @ApiResponse({ status: 200, description: 'Classes retrieved successfully' })
  @ApiQuery({ name: 'startDate', type: String, example: '2024-01-01T00:00:00Z' })
  @ApiQuery({ name: 'endDate', type: String, example: '2024-01-31T23:59:59Z' })
  @Get('date-range/search')
  findByDateRange(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.classesService.findByDateRange(new Date(startDate), new Date(endDate));
  }
}