# Education Management System - Backend

A robust backend system for classroom scheduling and management built with NestJS, featuring role-based access control and comprehensive API documentation.

## 🚀 Features

- **Role-Based Access Control**: Three distinct user roles with specific permissions
  - **Teachers**: Can schedule and manage their own classes
  - **Vice Directors**: Can manage all classes, subjects, and classrooms
  - **Directors**: Full system access including user management

- **Classroom Scheduling**: Advanced scheduling system with conflict detection
- **Subject Management**: Create and manage academic subjects
- **Classroom Management**: Manage physical classroom resources
- **User Management**: Complete user lifecycle management
- **JWT Authentication**: Secure token-based authentication
- **API Documentation**: Auto-generated Swagger documentation
- **Data Validation**: Comprehensive input validation and sanitization

## 🛠 Tech Stack

- **Framework**: NestJS (Node.js framework)
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT with Passport
- **Validation**: class-validator & class-transformer
- **Documentation**: Swagger/OpenAPI
- **Password Hashing**: bcryptjs

## 📋 Prerequisites

- Node.js (v16 or higher)
- PostgreSQL database
- npm or yarn package manager

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd education-management-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   ```
   
   Update the `.env` file with your database credentials:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/education_management?schema=public"
   JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
   JWT_EXPIRES_IN="7d"
   PORT=3000
   NODE_ENV=development
   ```

4. **Database Setup**
   ```bash
   # Generate Prisma client
   npm run prisma:generate
   
   # Run database migrations
   npm run prisma:migrate
   
   # Seed the database with initial data
   npm run prisma:seed
   ```

## 🚀 Running the Application

### Development Mode
```bash
npm run start:dev
```

### Production Mode
```bash
npm run build
npm run start:prod
```

The application will be available at:
- **API**: http://localhost:3000
- **Swagger Documentation**: http://localhost:3000/api

## 📚 API Documentation

### Authentication Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| POST | `/auth/login` | User login | Public |
| POST | `/auth/register` | User registration | Public |

### User Management

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/users` | Get all users | Directors, Vice Directors |
| GET | `/users/:id` | Get user by ID | Directors, Vice Directors |
| POST | `/users` | Create new user | Directors, Vice Directors |
| PATCH | `/users/:id` | Update user | Directors, Vice Directors |
| DELETE | `/users/:id` | Delete user | Directors only |

### Class Management

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/classes` | Get classes (filtered by role) | All authenticated |
| GET | `/classes/:id` | Get class by ID | All authenticated |
| POST | `/classes` | Create new class | All authenticated |
| PATCH | `/classes/:id` | Update class | All authenticated |
| DELETE | `/classes/:id` | Delete class | All authenticated |
| GET | `/classes/teacher/:teacherId` | Get classes by teacher | Directors, Vice Directors |
| GET | `/classes/classroom/:classroomId` | Get classes by classroom | All authenticated |
| GET | `/classes/date-range/search` | Get classes by date range | All authenticated |

### Subject Management

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/subjects` | Get all subjects | All authenticated |
| GET | `/subjects/:id` | Get subject by ID | All authenticated |
| POST | `/subjects` | Create new subject | Directors, Vice Directors |
| PATCH | `/subjects/:id` | Update subject | Directors, Vice Directors |
| DELETE | `/subjects/:id` | Delete subject | Directors only |

### Classroom Management

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/classrooms` | Get all classrooms | All authenticated |
| GET | `/classrooms/:id` | Get classroom by ID | All authenticated |
| POST | `/classrooms` | Create new classroom | Directors, Vice Directors |
| PATCH | `/classrooms/:id` | Update classroom | Directors, Vice Directors |
| DELETE | `/classrooms/:id` | Delete classroom | Directors only |

## 🏗 Project Structure

```
src/
├── auth/                   # Authentication module
│   ├── decorators/         # Custom decorators (roles)
│   ├── dto/               # Data transfer objects
│   ├── guards/            # Auth guards (JWT, Local, Roles)
│   ├── strategies/        # Passport strategies
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   └── auth.module.ts
├── classes/               # Class management module
│   ├── dto/
│   ├── classes.controller.ts
│   ├── classes.service.ts
│   └── classes.module.ts
├── classrooms/            # Classroom management module
│   ├── dto/
│   ├── classrooms.controller.ts
│   ├── classrooms.service.ts
│   └── classrooms.module.ts
├── subjects/              # Subject management module
│   ├── dto/
│   ├── subjects.controller.ts
│   ├── subjects.service.ts
│   └── subjects.module.ts
├── users/                 # User management module
│   ├── dto/
│   ├── users.controller.ts
│   ├── users.service.ts
│   └── users.module.ts
├── prisma/                # Database module
│   ├── prisma.service.ts
│   └── prisma.module.ts
├── app.module.ts          # Root application module
└── main.ts               # Application entry point
```

## 🔐 Authentication & Authorization

### JWT Authentication
All protected endpoints require a valid JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

### Role-Based Access Control

**Teachers**:
- Can create, read, update, and delete their own classes
- Can view all subjects and classrooms
- Cannot manage other users or system resources

**Vice Directors**:
- Can manage all classes regardless of teacher
- Can create, update, and delete subjects and classrooms
- Can create and manage user accounts (except other directors)
- Cannot delete users

**Directors**:
- Full system access
- Can perform all operations including user deletion
- Can manage all system resources

## 🗄 Database Schema

### Users
- `id`: Unique identifier
- `email`: User email (unique)
- `password`: Hashed password
- `firstName`: User's first name
- `lastName`: User's last name
- `role`: User role (TEACHER, VICE_DIRECTOR, DIRECTOR)
- `isActive`: Account status

### Classes
- `id`: Unique identifier
- `title`: Class title
- `description`: Class description
- `startTime`: Class start time
- `endTime`: Class end time
- `status`: Class status (SCHEDULED, COMPLETED, CANCELLED)
- `teacherId`: Reference to teacher
- `subjectId`: Reference to subject
- `classroomId`: Reference to classroom
- `createdById`: Reference to user who created the class

### Subjects
- `id`: Unique identifier
- `name`: Subject name (unique)
- `description`: Subject description
- `isActive`: Subject status

### Classrooms
- `id`: Unique identifier
- `name`: Classroom name (unique)
- `capacity`: Maximum capacity
- `description`: Classroom description
- `isActive`: Classroom status

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## 📝 Default Test Accounts

After running the seed command, the following test accounts are available:

| Email | Password | Role |
|-------|----------|------|
| director@school.com | password123 | Director |
| vice.director@school.com | password123 | Vice Director |
| teacher1@school.com | password123 | Teacher |
| teacher2@school.com | password123 | Teacher |

## 🔧 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run build` | Build the application |
| `npm run start` | Start the application |
| `npm run start:dev` | Start in development mode with hot reload |
| `npm run start:debug` | Start in debug mode |
| `npm run start:prod` | Start in production mode |
| `npm run lint` | Run ESLint |
| `npm run test` | Run unit tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:cov` | Run tests with coverage |
| `npm run test:e2e` | Run end-to-end tests |
| `npm run prisma:generate` | Generate Prisma client |
| `npm run prisma:migrate` | Run database migrations |
| `npm run prisma:seed` | Seed the database |
| `npm run prisma:studio` | Open Prisma Studio |

## 🚨 Business Rules

### Class Scheduling
- Teachers can only schedule classes for themselves
- Directors and Vice Directors can schedule classes for any teacher
- Classroom conflicts are automatically detected and prevented
- Classes cannot overlap in the same classroom

### User Management
- Only Directors and Vice Directors can create new users
- Only Directors can delete users
- Users cannot modify their own role

### Resource Management
- Only Directors and Vice Directors can manage subjects and classrooms
- Resources with associated classes cannot be hard deleted (soft delete applied)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For support and questions, please contact the development team or create an issue in the repository.
