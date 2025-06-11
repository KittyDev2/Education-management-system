import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create users
  const hashedPassword = await bcrypt.hash('password123', 10);

  const director = await prisma.user.upsert({
    where: { email: 'director@school.com' },
    update: {},
    create: {
      email: 'director@school.com',
      password: hashedPassword,
      firstName: 'John',
      lastName: 'Director',
      role: Role.DIRECTOR,
    },
  });

  const viceDirector = await prisma.user.upsert({
    where: { email: 'vice.director@school.com' },
    update: {},
    create: {
      email: 'vice.director@school.com',
      password: hashedPassword,
      firstName: 'Jane',
      lastName: 'Vice Director',
      role: Role.VICE_DIRECTOR,
    },
  });

  const teacher1 = await prisma.user.upsert({
    where: { email: 'teacher1@school.com' },
    update: {},
    create: {
      email: 'teacher1@school.com',
      password: hashedPassword,
      firstName: 'Alice',
      lastName: 'Teacher',
      role: Role.TEACHER,
    },
  });

  const teacher2 = await prisma.user.upsert({
    where: { email: 'teacher2@school.com' },
    update: {},
    create: {
      email: 'teacher2@school.com',
      password: hashedPassword,
      firstName: 'Bob',
      lastName: 'Teacher',
      role: Role.TEACHER,
    },
  });

  // Create subjects
  const mathematics = await prisma.subject.upsert({
    where: { name: 'Mathematics' },
    update: {},
    create: {
      name: 'Mathematics',
      description: 'Basic and advanced mathematics courses',
    },
  });

  const english = await prisma.subject.upsert({
    where: { name: 'English' },
    update: {},
    create: {
      name: 'English',
      description: 'English language and literature',
    },
  });

  const science = await prisma.subject.upsert({
    where: { name: 'Science' },
    update: {},
    create: {
      name: 'Science',
      description: 'General science and laboratory work',
    },
  });

  // Create classrooms
  const classroom101 = await prisma.classroom.upsert({
    where: { name: 'Room 101' },
    update: {},
    create: {
      name: 'Room 101',
      capacity: 30,
      description: 'Main classroom with projector',
    },
  });

  const classroom102 = await prisma.classroom.upsert({
    where: { name: 'Room 102' },
    update: {},
    create: {
      name: 'Room 102',
      capacity: 25,
      description: 'Science laboratory',
    },
  });

  const classroom103 = await prisma.classroom.upsert({
    where: { name: 'Room 103' },
    update: {},
    create: {
      name: 'Room 103',
      capacity: 35,
      description: 'Large lecture hall',
    },
  });

  console.log('Database seeded successfully!');
  console.log('Test accounts created:');
  console.log('Director: director@school.com / password123');
  console.log('Vice Director: vice.director@school.com / password123');
  console.log('Teacher 1: teacher1@school.com / password123');
  console.log('Teacher 2: teacher2@school.com / password123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });