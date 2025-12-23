# 🎓 Student Course Management System

A comprehensive full-stack application built with Node.js, Express, React, and MySQL for managing students and their associated courses, demonstrating professional backend development, SQL database design, and RESTful API implementation.

## 🚀 Features

### Backend

- **Authentication & Authorization**: JWT-based authentication with role-based access control (ADMIN, STUDENT)
- **Course Management**: Full CRUD operations for courses
- **Student Management**: Complete student management with course assignments
- **Stored Procedures**: Optional advanced database operations with transaction management
- **Data Validation**: Input validation using express-validator
- **Secure APIs**: Password hashing with bcrypt, JWT tokens, protected routes
- **Clean Architecture**: Organized folder structure with controllers, models, routes, and middleware
- **Error Handling**: Centralized error handling with meaningful error messages
- **Database Relations**: Proper foreign key constraints and referential integrity

### Frontend

- **React 19**: Modern React application with hooks
- **Routing**: React Router for navigation
- **State Management**: Context API for authentication state
- **Protected Routes**: Route guards based on user roles
- **Responsive UI**: Clean and intuitive user interface
- **Admin Panel**: Manage courses and students
- **Student Portal**: View personal course information

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v14 or higher)
- [MySQL](https://www.mysql.com/) (v5.7 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Postman](https://www.postman.com/) (for API testing - optional)

## 🛠️ Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/dineshdhayfule/Sciqus-Backend-Task.git
cd Sciqus-Backend-Task
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file from example
cp .env.example .env

# Edit .env with your database credentials
# DB_HOST=localhost
# DB_USER=root
# DB_PASSWORD=yourpassword
# DB_NAME=student_course_db
# DB_PORT=3306
# PORT=3000
# JWT_SECRET=your_jwt_secret_key_here_change_in_production
# JWT_EXPIRES_IN=24h
```

### 3. Database Setup

#### Option A: Using MySQL Command Line

```bash
# Login to MySQL
mysql -u root -p

# Create database and run schema
source sql/schema.sql

# (Optional) Install stored procedures for advanced operations
source sql/stored_procedures.sql
```

#### Option B: Using MySQL Workbench

1. Open MySQL Workbench
2. Create a new connection
3. Open the `backend/sql/schema.sql` file
4. Execute the script
5. (Optional) Open and execute `backend/sql/stored_procedures.sql`

### 4. Frontend Setup

```bash
# Navigate to frontend directory (from root)
cd frontend

# Install dependencies
npm install
```

### 5. Start the Application

#### Start Backend (Terminal 1)

```bash
cd backend
npm run dev
```

Backend will run on `http://localhost:3000`

#### Start Frontend (Terminal 2)

```bash
cd frontend
npm run dev
```

Frontend will run on `http://localhost:5173`

## 📁 Project Structure

```
Sciqus-Backend-Task/
├── backend/
│   ├── src/
│   │   ├── controllers/          # Request handlers
│   │   ├── routes/               # API routes
│   │   ├── models/               # Database models
│   │   ├── middleware/           # Custom middleware
│   │   ├── validators/           # Input validation rules
│   │   ├── config/               # Configuration files
│   │   └── app.js                # Main application file
│   ├── sql/
│   │   ├── schema.sql            # Database schema
│   │   └── stored_procedures.sql # Stored procedures (optional)
│   ├── .env.example              # Environment variables template
│   ├── package.json
│   ├── postman_collection.json   # Postman API collection
│   └── TESTING.md                # API testing guide
├── frontend/
│   ├── src/
│   │   ├── components/           # React components
│   │   ├── pages/                # Page components
│   │   ├── context/              # Context providers
│   │   ├── services/             # API services
│   │   └── main.jsx              # Entry point
│   ├── public/
│   ├── package.json
│   └── vite.config.js
├── .gitignore
└── README.md
```

## 🔑 API Endpoints

### Base URL

```
http://localhost:3000/api
```

### Authentication

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/auth/login` | User login | Public |
| POST | `/auth/register` | Student registration | Public |

### Courses

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/courses` | Get all courses | Authenticated |
| GET | `/courses/:id` | Get course by ID | Authenticated |
| POST | `/courses` | Create new course | Admin only |
| PUT | `/courses/:id` | Update course | Admin only |
| DELETE | `/courses/:id` | Delete course | Admin only |
| GET | `/courses/:id/students` | Get students in course | Admin only |

### Students

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/students` | Get all students | Admin only |
| GET | `/students/:id` | Get student by ID | Admin only |
| POST | `/students` | Create new student | Admin only |
| PUT | `/students/:id` | Update student | Admin only |
| DELETE | `/students/:id` | Delete student | Admin only |
| GET | `/students/course/:courseId` | Get students by course | Admin only |
| GET | `/students/me` | Get own details | Student only |
| GET | `/students/me/courses` | Get own courses | Student only |

## 🧪 Testing

### Sample Test Users

**Admin Account:**

- Username: `admin`
- Password: `admin123`

**Student Accounts:**

- Username: `john.doe` / Password: `student123`
- Username: `jane.smith` / Password: `student123`
- Username: `bob.johnson` / Password: `student123`

### Testing with Postman

1. Import the collection: `backend/postman_collection.json`
2. Run "Admin Login" to get authentication token
3. Token is automatically saved for subsequent requests
4. Test all endpoints

See `backend/TESTING.md` for detailed testing instructions.

### Testing with Frontend

1. Open `http://localhost:5173`
2. Login with admin or student credentials
3. Admin: Manage courses and students
4. Student: View personal course information

## 🗄️ Database Schema

### Tables

#### courses

- `course_id` (Primary Key, Auto Increment)
- `course_name` (VARCHAR)
- `course_code` (VARCHAR, UNIQUE)
- `course_duration` (INTEGER - months)
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
- `password` (VARCHAR - hashed with bcrypt)
- `role` (ENUM: 'ADMIN', 'STUDENT')
- `student_id` (Foreign Key → students, nullable)
- `created_at`, `updated_at` (TIMESTAMP)

## 🔐 Security Features

- **Password Hashing**: bcrypt with salt rounds
- **JWT Authentication**: Stateless authentication
- **Role-Based Access Control**: Admin and Student roles
- **Input Validation**: express-validator
- **SQL Injection Prevention**: Prepared statements
- **CORS**: Configured for frontend integration
- **Environment Variables**: Sensitive data in .env

## 📝 Additional Features

### Stored Procedures (Optional)

Located in `backend/sql/stored_procedures.sql`:

1. `sp_insert_student_with_course` - Insert with validation
2. `sp_update_student_details` - Update with transactions
3. `sp_delete_student` - Delete with cascade
4. `sp_get_students_by_course` - Retrieve by course
5. `sp_insert_course` - Insert course with validation
6. `sp_update_course` - Update course with validation

### Transaction Management

- Automatic rollback on errors
- Data consistency guaranteed
- Used in critical operations (create, update, delete)

### Foreign Key Constraints

- Course cannot be deleted if students are enrolled
- Deleting student automatically removes user account
- Course validation before student assignment

## 🚀 Deployment

### Backend Deployment

1. Set environment variables for production
2. Update `JWT_SECRET` with strong secret key
3. Set `NODE_ENV=production`
4. Configure database credentials
5. Deploy to your preferred platform (Heroku, AWS, Azure, etc.)

### Frontend Deployment

1. Update API base URL in `frontend/src/services/api.js`
2. Build production version: `npm run build`
3. Deploy `dist` folder to hosting service (Vercel, Netlify, etc.)

## 🎯 Tech Stack

### Backend

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MySQL
- **Authentication**: JWT + bcrypt
- **Validation**: express-validator
- **Database Driver**: mysql2

### Frontend

- **Framework**: React 19
- **Build Tool**: Vite
- **Routing**: React Router v7
- **HTTP Client**: Axios
- **State Management**: Context API

## 📚 Documentation

- `backend/README.md` - Detailed backend documentation
- `backend/TESTING.md` - API testing guide
- `backend/SCREENSHOTS_GUIDE.md` - Testing screenshot requirements
- `backend/SUBMISSION_CHECKLIST.md` - Requirements verification
- `backend/COMPLETION_SUMMARY.md` - Project completion overview
- `backend/QUICK_REFERENCE.md` - Quick start commands

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 👨‍💻 Author

**Dinesh Dhayfule**

- GitHub: [@dineshdhayfule](https://github.com/dineshdhayfule)

## 🙏 Acknowledgments

- SCIQUS - Innovation at Core
- Backend Task December 2024

---

**🎉 Project Status: Complete & Production Ready**

All mandatory and optional requirements implemented with comprehensive documentation and testing tools.
