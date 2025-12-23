# 🚀 Quick Reference - Student Course Management System

## ⚡ Start Commands

```bash
# Backend (Terminal 1)
cd backend
npm run dev
# Server: http://localhost:3000

# Frontend (Terminal 2)  
cd frontend
npm run dev
# App: http://localhost:5173
```

## 🔐 Default Login Credentials

**Admin:**

- Username: `admin`
- Password: `admin123`

**Student:**

- Username: `john.doe`
- Password: `student123`

## 📁 Important Files

| File | Purpose |
|------|---------|
| `sql/schema.sql` | Database schema - RUN FIRST |
| `sql/stored_procedures.sql` | Stored procedures - OPTIONAL |
| `postman_collection.json` | Import into Postman for testing |
| `.env.example` | Copy to `.env` and configure |
| `COMPLETION_SUMMARY.md` | Full project summary |
| `SUBMISSION_CHECKLIST.md` | Requirement verification |
| `SCREENSHOTS_GUIDE.md` | Testing screenshot guide |
| `TESTING.md` | API testing instructions |
| `README.md` | Main documentation |

## 🗄️ Database Setup

```bash
# Create database and tables
mysql -u root -p < sql/schema.sql

# Install stored procedures (optional)
mysql -u root -p < sql/stored_procedures.sql
```

## 🧪 Quick Test (Postman)

1. Import `postman_collection.json`
2. Run **"Admin Login"** → Token auto-saves
3. Run **"Get All Courses"** → See courses
4. Run **"Get All Students"** → See students with courses
5. Run **"Create Student"** → Add new student
6. Run **"Get Students by Course"** → Filter by course

## 📍 API Endpoints

**Base URL:** `http://localhost:3000/api`

### Auth

- POST `/auth/login` - Login
- POST `/auth/register` - Register student

### Courses (Admin)

- GET `/courses` - List all
- POST `/courses` - Create
- PUT `/courses/:id` - Update
- DELETE `/courses/:id` - Delete
- GET `/courses/:id/students` - Get students in course

### Students (Admin)

- GET `/students` - List all with courses
- POST `/students` - Create with course
- PUT `/students/:id` - Update & change course
- DELETE `/students/:id` - Delete
- GET `/students/:id` - Get by ID
- GET `/students/course/:courseId` - By course

### Students (Student Role)

- GET `/students/me` - Own profile
- GET `/students/me/courses` - Own course

## 🔧 Stored Procedures

```sql
-- Test in MySQL
CALL sp_insert_student_with_course('Name', 'email@test.com', 1, @id, @status, @msg);
CALL sp_update_student_details(1, 'New Name', 'new@test.com', 2, @status, @msg);
CALL sp_get_students_by_course(1);
CALL sp_delete_student(5, @status, @msg);
```

## ✅ Completion Status

- ✅ All mandatory requirements
- ✅ Stored procedures (optional)
- ✅ Frontend (bonus)
- ✅ Complete documentation
- ✅ Postman collection
- ✅ Testing guides

## 📸 Next Step

Generate screenshots following `SCREENSHOTS_GUIDE.md`:

- Admin login success
- Get all courses/students
- Create/update operations
- Authorization tests
- Error validations

## 🎯 Submission Files

**Must Include:**

1. All source code (`backend/` and `frontend/`)
2. `sql/schema.sql` and `sql/stored_procedures.sql`
3. All documentation (`.md` files)
4. `postman_collection.json`
5. Testing screenshots (from SCREENSHOTS_GUIDE.md)
6. `.env.example`

## 💡 Tips

- Run backend first, then frontend
- Use Postman for easy API testing
- Check console for errors
- Database must be running
- Check `.env` configuration

## 📞 Troubleshooting

**Can't connect to database:**

- Check MySQL is running
- Verify `.env` credentials
- Confirm database exists

**Login not working:**

- Check frontend API baseURL
- Verify backend is running
- Check browser console

**Token errors:**

- Login again to get fresh token
- Check Authorization header format

---

**🎉 Project Status: COMPLETE & READY TO SUBMIT!**
