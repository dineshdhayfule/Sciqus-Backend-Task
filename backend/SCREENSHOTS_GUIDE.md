# Testing Screenshots Guide

This document provides instructions for generating testing screenshots to demonstrate the complete functionality of the Student Course Management System API.

## 📸 Required Screenshots

### 1. Authentication Tests

#### Screenshot 1: Admin Login Success

- **Endpoint:** `POST /api/auth/login`
- **Body:**

  ```json
  {
    "username": "admin",
    "password": "admin123"
  }
  ```

- **Expected:** 200 OK with JWT token
- **Capture:** Response showing token, user details, and role

#### Screenshot 2: Student Login Success

- **Endpoint:** `POST /api/auth/login`
- **Body:**

  ```json
  {
    "username": "john.doe",
    "password": "student123"
  }
  ```

- **Expected:** 200 OK with JWT token
- **Capture:** Response showing token, user details, and student role

#### Screenshot 3: Invalid Credentials Error

- **Endpoint:** `POST /api/auth/login`
- **Body:**

  ```json
  {
    "username": "wronguser",
    "password": "wrongpass"
  }
  ```

- **Expected:** 401 Unauthorized
- **Capture:** Error message "Invalid username or password"

#### Screenshot 4: Register New Student

- **Endpoint:** `POST /api/auth/register`
- **Body:**

  ```json
  {
    "name": "Test Student",
    "email": "teststudent@example.com",
    "course_id": 1,
    "username": "teststudent",
    "password": "student123"
  }
  ```

- **Expected:** 201 Created
- **Capture:** Success response with new student details

---

### 2. Admin - Course Management

#### Screenshot 5: Get All Courses

- **Endpoint:** `GET /api/courses`
- **Headers:** `Authorization: Bearer {admin_token}`
- **Expected:** 200 OK with array of all courses
- **Capture:** List showing all courses with details

#### Screenshot 6: Create New Course

- **Endpoint:** `POST /api/courses`
- **Headers:** `Authorization: Bearer {admin_token}`
- **Body:**

  ```json
  {
    "course_name": "Cloud Computing",
    "course_code": "CC601",
    "course_duration": 30
  }
  ```

- **Expected:** 201 Created
- **Capture:** Success message with created course

#### Screenshot 7: Update Course

- **Endpoint:** `PUT /api/courses/1`
- **Headers:** `Authorization: Bearer {admin_token}`
- **Body:**

  ```json
  {
    "course_name": "Advanced Computer Science",
    "course_code": "CS101",
    "course_duration": 48
  }
  ```

- **Expected:** 200 OK
- **Capture:** Success message with updated course

#### Screenshot 8: Get Course by ID

- **Endpoint:** `GET /api/courses/1`
- **Headers:** `Authorization: Bearer {admin_token}`
- **Expected:** 200 OK
- **Capture:** Detailed course information

#### Screenshot 9: Delete Course (Error - Students Enrolled)

- **Endpoint:** `DELETE /api/courses/1`
- **Headers:** `Authorization: Bearer {admin_token}`
- **Expected:** 400 Bad Request (if students enrolled)
- **Capture:** Error message about foreign key constraint

---

### 3. Admin - Student Management

#### Screenshot 10: Get All Students with Course Details

- **Endpoint:** `GET /api/students`
- **Headers:** `Authorization: Bearer {admin_token}`
- **Expected:** 200 OK
- **Capture:** List of students with their course information

#### Screenshot 11: Create Student with Course Assignment

- **Endpoint:** `POST /api/students`
- **Headers:** `Authorization: Bearer {admin_token}`
- **Body:**

  ```json
  {
    "name": "Sarah Williams",
    "email": "sarah.williams@example.com",
    "course_id": 2,
    "username": "sarah.williams",
    "password": "student123"
  }
  ```

- **Expected:** 201 Created
- **Capture:** Success with student and course details

#### Screenshot 12: Update Student and Change Course

- **Endpoint:** `PUT /api/students/1`
- **Headers:** `Authorization: Bearer {admin_token}`
- **Body:**

  ```json
  {
    "name": "John Doe Updated",
    "email": "john.doe@example.com",
    "course_id": 3
  }
  ```

- **Expected:** 200 OK
- **Capture:** Success showing course reassignment

#### Screenshot 13: Get Student by ID

- **Endpoint:** `GET /api/students/1`
- **Headers:** `Authorization: Bearer {admin_token}`
- **Expected:** 200 OK
- **Capture:** Detailed student with course info

#### Screenshot 14: Get Students by Course

- **Endpoint:** `GET /api/students/course/1`
- **Headers:** `Authorization: Bearer {admin_token}`
- **Expected:** 200 OK
- **Capture:** All students enrolled in course 1

#### Screenshot 15: Delete Student

- **Endpoint:** `DELETE /api/students/5`
- **Headers:** `Authorization: Bearer {admin_token}`
- **Expected:** 200 OK
- **Capture:** Success message

---

### 4. Student Role - Own Profile Access

#### Screenshot 16: Student Get Own Details

- **Endpoint:** `GET /api/students/me`
- **Headers:** `Authorization: Bearer {student_token}`
- **Expected:** 200 OK
- **Capture:** Student's own profile with course details

#### Screenshot 17: Student Get Own Courses

- **Endpoint:** `GET /api/students/me/courses`
- **Headers:** `Authorization: Bearer {student_token}`
- **Expected:** 200 OK
- **Capture:** Course information for logged-in student

---

### 5. Authorization Tests

#### Screenshot 18: Student Trying Admin Endpoint (Forbidden)

- **Endpoint:** `GET /api/students` (list all)
- **Headers:** `Authorization: Bearer {student_token}`
- **Expected:** 403 Forbidden
- **Capture:** Error message about insufficient permissions

#### Screenshot 19: No Token Access (Unauthorized)

- **Endpoint:** `GET /api/students`
- **Headers:** None
- **Expected:** 401 Unauthorized
- **Capture:** Error message "No token provided"

---

### 6. Validation Tests

#### Screenshot 20: Create Student with Invalid Course

- **Endpoint:** `POST /api/students`
- **Headers:** `Authorization: Bearer {admin_token}`
- **Body:**

  ```json
  {
    "name": "Invalid Student",
    "email": "invalid@example.com",
    "course_id": 999,
    "username": "invalidstudent",
    "password": "student123"
  }
  ```

- **Expected:** 400 Bad Request
- **Capture:** Error "Invalid course. Course does not exist."

#### Screenshot 21: Duplicate Email Registration

- **Endpoint:** `POST /api/auth/register`
- **Body:**

  ```json
  {
    "name": "Duplicate",
    "email": "john.doe@example.com",
    "course_id": 1,
    "username": "duplicate",
    "password": "student123"
  }
  ```

- **Expected:** 400 Bad Request
- **Capture:** Error "Email already exists"

#### Screenshot 22: Missing Required Fields

- **Endpoint:** `POST /api/courses`
- **Headers:** `Authorization: Bearer {admin_token}`
- **Body:**

  ```json
  {
    "course_name": "Test Course"
  }
  ```

- **Expected:** 400 Bad Request
- **Capture:** Validation errors for missing fields

---

### 7. Database Features

#### Screenshot 23: Course with Students (DELETE RESTRICT)

- **Endpoint:** `GET /api/courses/1/students`
- **Headers:** `Authorization: Bearer {admin_token}`
- **Expected:** 200 OK
- **Capture:** List of students in the course

Then try to delete:

- **Endpoint:** `DELETE /api/courses/1`
- **Expected:** Error due to foreign key constraint
- **Capture:** Error message

---

## 📋 Testing Checklist

Use this checklist to ensure complete testing coverage:

- [ ] Admin login successful
- [ ] Student login successful
- [ ] Invalid login credentials
- [ ] New student registration
- [ ] Get all courses
- [ ] Create new course
- [ ] Update course
- [ ] Get course by ID
- [ ] Attempt to delete course with students
- [ ] Get all students
- [ ] Create student with course
- [ ] Update student and change course
- [ ] Get student by ID
- [ ] Get students by course
- [ ] Delete student
- [ ] Student views own profile
- [ ] Student views own course
- [ ] Student forbidden from admin endpoint
- [ ] Unauthorized access without token
- [ ] Invalid course ID validation
- [ ] Duplicate email validation
- [ ] Missing required fields validation
- [ ] Foreign key constraint enforcement

---

## 🛠️ How to Generate Screenshots

### Using Postman

1. **Import Collection:**
   - Import `postman_collection.json` into Postman
   - Collection includes all test cases

2. **Setup Environment:**
   - Create environment with `baseUrl` = `http://localhost:3000/api`
   - Token will be auto-saved after login

3. **Run Tests Sequentially:**
   - Start with "Admin Login" to get token
   - Run each endpoint and take screenshots
   - For student tests, use "Student Login" first

4. **Capture Screenshots:**
   - Show the request (method, URL, headers, body)
   - Show the complete response (status, body)
   - Use Postman's built-in screenshot or snipping tool

### Alternative: Using cURL

```bash
# Admin Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# Get All Students
curl -X GET http://localhost:3000/api/students \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 📊 Screenshot Organization

Organize screenshots in a folder structure:

```
screenshots/
├── 01_authentication/
│   ├── admin_login_success.png
│   ├── student_login_success.png
│   ├── invalid_credentials.png
│   └── register_student.png
├── 02_courses/
│   ├── get_all_courses.png
│   ├── create_course.png
│   ├── update_course.png
│   └── delete_course_error.png
├── 03_students/
│   ├── get_all_students.png
│   ├── create_student.png
│   ├── update_student.png
│   └── delete_student.png
├── 04_authorization/
│   ├── student_forbidden.png
│   └── no_token_unauthorized.png
└── 05_validation/
    ├── invalid_course.png
    ├── duplicate_email.png
    └── missing_fields.png
```

---

## 🚀 Quick Test Script

Run all tests quickly using this order:

1. Login as Admin
2. Get all courses
3. Create new course
4. Get all students
5. Create new student
6. Update student's course
7. Get students by course
8. Login as Student
9. Get student own profile
10. Try admin endpoint as student (should fail)
11. Test validation errors

---

## ✅ Expected Results Summary

All tests should demonstrate:

- **Authentication:** JWT tokens generated correctly
- **Authorization:** Role-based access working
- **CRUD Operations:** All create, read, update, delete working
- **Validations:** Proper error messages for invalid data
- **Foreign Keys:** Course validation and constraint enforcement
- **Transactions:** Data consistency maintained
- **Security:** Passwords hashed, tokens required
