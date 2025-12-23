# Student Course Management System - Backend

A comprehensive backend system built with Node.js and Express for managing students and their associated courses, demonstrating professional backend development, SQL database design, and RESTful API implementation.

## 🚀 Features

- **Authentication & Authorization**: JWT-based authentication with role-based access control (ADMIN, STUDENT)
- **Course Management**: Full CRUD operations for courses
- **Student Management**: Complete student management with course assignments
- **Data Validation**: Input validation using express-validator
- **Secure APIs**: Password hashing with bcrypt, JWT tokens, protected routes
- **Clean Architecture**: Organized folder structure with controllers, models, routes, and middleware
- **Error Handling**: Centralized error handling with meaningful error messages
- **Database Relations**: Proper foreign key constraints and referential integrity

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v14 or higher)
- [MySQL](https://www.mysql.com/) (v5.7 or higher) or [PostgreSQL](https://www.postgresql.org/)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Postman](https://www.postman.com/) (for API testing)

## 🛠️ Installation & Setup

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd Backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Database Setup

#### Option A: Using MySQL Command Line

```bash
# Login to MySQL
mysql -u root -p

# Create database and tables
source sql/schema.sql

# (Optional) Install stored procedures for advanced operations
source sql/stored_procedures.sql
```

#### Option B: Using MySQL Workbench

1. Open MySQL Workbench
2. Create a new connection
3. Open the `sql/schema.sql` file
4. Execute the script
5. (Optional) Open and execute `sql/stored_procedures.sql` for stored procedure support

### 4. Environment Configuration

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit the `.env` file with your database credentials:

```env
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=student_course_db
DB_PORT=3306

# Server Configuration
PORT=3000
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here_change_in_production
JWT_EXPIRES_IN=24h
```

### 5. Start the Server

```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:3000`

## 📁 Project Structure

```
backend/
├── src/
│   ├── controllers/          # Request handlers
│   │   ├── authController.js
│   │   ├── courseController.js
│   │   └── studentController.js
│   ├── routes/               # API routes
│   │   ├── authRoutes.js
│   │   ├── courseRoutes.js
│   │   └── studentRoutes.js
│   ├── models/               # Database models
│   │   ├── Course.js
│   │   ├── Student.js
│   │   └── User.js
│   ├── middleware/           # Custom middleware
│   │   ├── authenticate.js
│   │   ├── authorize.js
│   │   ├── validate.js
│   │   └── errorHandler.js
│   ├── validators/           # Input validation rules
│   │   ├── authValidator.js
│   │   ├── courseValidator.js
│   │   └── studentValidator.js
│   ├── config/               # Configuration files
│   │   └── database.js
│   └── app.js                # Main application file
├── sql/
│   ├── schema.sql            # Database schema
│   └── stored_procedures.sql # Stored procedures (optional)
├── .env.example              # Environment variables template
├── .gitignore
├── package.json
├── postman_collection.json   # Postman API collection
├── TESTING.md                # API testing guide
└── README.md
```

## 🔑 API Endpoints

### Base URL

```
http://localhost:3000/api
```

### Authentication

#### Login

```http
POST /auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "userId": 1,
      "username": "admin",
      "role": "ADMIN",
      "studentId": null
    }
  }
}
```

### Admin APIs (Requires ADMIN role)

#### Add Course

```http
POST /courses
Authorization: Bearer <token>
Content-Type: application/json

{
  "course_name": "Artificial Intelligence",
  "course_code": "AI501",
  "course_duration": 36
}
```

#### Add Student

```http
POST /students
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Alice Johnson",
  "email": "alice.johnson@example.com",
  "course_id": 1,
  "username": "alice.johnson",
  "password": "student123"
}
```

#### Update Student & Change Course

```http
PUT /students/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Alice Johnson",
  "email": "alice.johnson@example.com",
  "course_id": 2
}
```

#### Delete Student

```http
DELETE /students/:id
Authorization: Bearer <token>
```

#### Get All Students with Course Details

```http
GET /students
Authorization: Bearer <token>
```

#### Get Students by Course

```http
GET /students/course/:courseId
Authorization: Bearer <token>
```

### Student APIs (Requires STUDENT role)

#### View Own Details & Course

```http
GET /students/me
Authorization: Bearer <token>
```

### Common APIs (Both ADMIN and STUDENT)

#### Get All Courses

```http
GET /courses
Authorization: Bearer <token>
```

#### Get Course by ID

```http
GET /courses/:id
Authorization: Bearer <token>
```

## 🔒 Authentication & Authorization

All API endpoints (except `/auth/login`) require authentication using JWT tokens.

### How to Use Authentication

1. **Login** to get a JWT token
2. **Include the token** in the Authorization header for subsequent requests:

   ```
   Authorization: Bearer <your_token>
   ```

### Role-Based Access Control

- **ADMIN**: Full access to all endpoints
- **STUDENT**: Read-only access to their own data (`/students/me`)

## 🧪 Testing with Postman

### Sample Test Users

**Admin Account:**

- Username: `admin`
- Password: `admin123`

**Student Accounts:**

- Username: `john.doe` / Password: `student123`
- Username: `jane.smith` / Password: `student123`
- Username: `bob.johnson` / Password: `student123`

### Testing Workflow

1. **Import Environment** (Optional)
   - Create a Postman environment
   - Add variable: `baseUrl` = `http://localhost:3000/api`
   - Add variable: `token` (will be set after login)

2. **Test Authentication**
   - Login with admin credentials
   - Copy the token from the response
   - Set it in your environment or use it in subsequent requests

3. **Test Admin Operations**
   - Create a new course
   - Add a student
   - Update student information
   - Get all students
   - Delete a student

4. **Test Student Operations**
   - Login as a student
   - Access `/students/me` endpoint
   - Verify that student cannot access admin endpoints

## ✅ Validation Rules

### Course Validation

- `course_name`: Required, 3-255 characters
- `course_code`: Required, 2-50 characters, alphanumeric with hyphens/underscores, unique
- `course_duration`: Required, 1-120 months

### Student Validation

- `name`: Required, 2-255 characters
- `email`: Required, valid email format, unique
- `course_id`: Required, must reference existing course
- `username`: Optional, 3-100 characters, unique
- `password`: Optional, minimum 6 characters

## 🗄️ Database Schema

### Tables

#### courses

- `course_id` (Primary Key, Auto Increment)
- `course_name` (VARCHAR)
- `course_code` (VARCHAR, UNIQUE)
- `course_duration` (INTEGER)
- `created_at`, `updated_at` (TIMESTAMP)

#### students

- `student_id` (Primary Key, Auto Increment)
- `name` (VARCHAR)
- `email` (VARCHAR, UNIQUE)
- `course_id` (Foreign Key → courses)
- `created_at`, `updated_at` (TIMESTAMP)

#### users

- `user_id` (Primary Key, Auto Increment)
- `username` (VARCHAR, UNIQUE)
- `password` (VARCHAR - hashed)
- `role` (ENUM: 'ADMIN', 'STUDENT')
- `student_id` (Foreign Key → students, nullable)
- `created_at`, `updated_at` (TIMESTAMP)

## 🔐 Security Features

- **Password Hashing**: Passwords are hashed using bcrypt with salt rounds
- **JWT Authentication**: Stateless authentication using JSON Web Tokens
- **Role-Based Access**: Middleware enforces role-based permissions
- **Input Validation**: All inputs are validated and sanitized
- **SQL Injection Prevention**: Prepared statements via mysql2
- **CORS Enabled**: Configured for cross-origin requests

## 🐛 Error Handling

The API uses standardized error responses:

```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    {
      "field": "email",
      "message": "Email already exists"
    }
  ]
}
```

## 📝 Additional Notes

### Stored Procedures (Optional Feature)

This project includes **optional stored procedures** for advanced database operations with built-in validation and transaction management. The stored procedures are located in `sql/stored_procedures.sql`.

#### Available Stored Procedures

1. **sp_insert_student_with_course** - Insert student with course validation
2. **sp_update_student_details** - Update student with transaction safety
3. **sp_delete_student** - Delete student and associated user account
4. **sp_get_students_by_course** - Retrieve students by course
5. **sp_insert_course** - Insert course with validation
6. **sp_update_course** - Update course with validation

#### Using Stored Procedures

The models include methods to use stored procedures:

```javascript
// Using stored procedures in Student model
await Student.createWithProcedure({ name, email, course_id });
await Student.updateWithProcedure(studentId, { name, email, course_id });
await Student.deleteWithProcedure(studentId);
await Student.findByCourseWithProcedure(courseId);

// Using stored procedures in Course model
await Course.createWithProcedure({ course_name, course_code, course_duration });
await Course.updateWithProcedure(courseId, { course_name, course_code, course_duration });
```

#### Benefits of Stored Procedures

- ✅ Built-in validation at database level
- ✅ Automatic transaction management
- ✅ Reduced application-database round trips
- ✅ Centralized business logic
- ✅ Better error handling with status outputs

### Testing with Postman

A complete Postman collection is provided: `postman_collection.json`

**Import Instructions:**

1. Open Postman
2. Click Import → Upload Files
3. Select `postman_collection.json`
4. Collection will include all endpoints with examples
5. Use the "Admin Login" request first to authenticate

The collection includes:

- ✅ All authentication endpoints
- ✅ All admin CRUD operations
- ✅ Student profile endpoints
- ✅ Error case testing
- ✅ Auto-save JWT tokens
- ✅ Environment variables setup

See `TESTING.md` for detailed testing instructions.

### Foreign Key Constraints

- Cannot delete a course if students are enrolled
- Deleting a student automatically removes their user account
- Course assignment is validated before creating/updating students

### Best Practices Implemented

- ✅ Clean separation of concerns (MVC pattern)
- ✅ Centralized error handling
- ✅ Input validation and sanitization
- ✅ Secure password storage
- ✅ JWT-based authentication
- ✅ Role-based authorization
- ✅ Database transaction support
- ✅ Meaningful HTTP status codes
- ✅ Comprehensive API documentation

## 🚀 Deployment

### Environment Variables for Production

- Update `JWT_SECRET` with a strong secret key
- Set `NODE_ENV=production`
- Use environment-specific database credentials
- Configure CORS for your frontend domain

## 📧 Support

For questions or issues, please create an issue in the GitHub repository.

## 📄 License

This project is licensed under the ISC License.
