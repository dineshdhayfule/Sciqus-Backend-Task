# API Testing Guide - Postman Collection

## Quick Start

### 1. Setup Environment Variables in Postman

Create a new environment in Postman with these variables:

- `baseUrl`: `http://localhost:3000/api`
- `token`: (leave empty, will be auto-filled after login)

### 2. Test Sequence

Follow this sequence to test all endpoints:

## Authentication

### 1. Admin Login

```
POST {{baseUrl}}/auth/login
Body (JSON):
{
  "username": "admin",
  "password": "admin123"
}
```

✅ Copy the token from response and save it in Postman environment variable `token`

### 2. Student Login

```
POST {{baseUrl}}/auth/login
Body (JSON):
{
  "username": "john.doe",
  "password": "student123"
}
```

## Admin Tests (Use Admin Token)

### Course Management

#### 3. Get All Courses

```
GET {{baseUrl}}/courses
Headers:
Authorization: Bearer {{token}}
```

#### 4. Create New Course

```
POST {{baseUrl}}/courses
Headers:
Authorization: Bearer {{token}}
Body (JSON):
{
  "course_name": "Artificial Intelligence",
  "course_code": "AI501",
  "course_duration": 36
}
```

#### 5. Get Course by ID

```
GET {{baseUrl}}/courses/1
Headers:
Authorization: Bearer {{token}}
```

#### 6. Update Course

```
PUT {{baseUrl}}/courses/1
Headers:
Authorization: Bearer {{token}}
Body (JSON):
{
  "course_name": "Computer Science Advanced",
  "course_code": "CS101",
  "course_duration": 50
}
```

### Student Management

#### 7. Create New Student

```
POST {{baseUrl}}/students
Headers:
Authorization: Bearer {{token}}
Body (JSON):
{
  "name": "Alice Johnson",
  "email": "alice.johnson@example.com",
  "course_id": 1,
  "username": "alice.johnson",
  "password": "student123"
}
```

#### 8. Get All Students

```
GET {{baseUrl}}/students
Headers:
Authorization: Bearer {{token}}
```

#### 9. Get Student by ID

```
GET {{baseUrl}}/students/1
Headers:
Authorization: Bearer {{token}}
```

#### 10. Update Student (Change Course)

```
PUT {{baseUrl}}/students/1
Headers:
Authorization: Bearer {{token}}
Body (JSON):
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "course_id": 2
}
```

#### 11. Get Students by Course

```
GET {{baseUrl}}/students/course/1
Headers:
Authorization: Bearer {{token}}
```

#### 12. Delete Student

```
DELETE {{baseUrl}}/students/4
Headers:
Authorization: Bearer {{token}}
```

## Student Tests (Use Student Token)

#### 13. Student - View Own Details

```
GET {{baseUrl}}/students/me
Headers:
Authorization: Bearer {{token}}
```

#### 14. Student - Try to Access Admin Endpoint (Should Fail)

```
GET {{baseUrl}}/students
Headers:
Authorization: Bearer {{token}}
```

❌ Expected: 403 Forbidden

## Validation Tests

#### 15. Create Course - Invalid Data

```
POST {{baseUrl}}/courses
Headers:
Authorization: Bearer {{token}}
Body (JSON):
{
  "course_name": "AI",
  "course_code": "A",
  "course_duration": 200
}
```

❌ Expected: Validation errors

#### 16. Create Student - Invalid Course ID

```
POST {{baseUrl}}/students
Headers:
Authorization: Bearer {{token}}
Body (JSON):
{
  "name": "Test User",
  "email": "test@example.com",
  "course_id": 999
}
```

❌ Expected: Course does not exist error

#### 17. Create Student - Duplicate Email

```
POST {{baseUrl}}/students
Headers:
Authorization: Bearer {{token}}
Body (JSON):
{
  "name": "Another User",
  "email": "john.doe@example.com",
  "course_id": 1
}
```

❌ Expected: Email already exists error

## Error Handling Tests

#### 18. Access Protected Route Without Token

```
GET {{baseUrl}}/students
```

❌ Expected: 401 Unauthorized

#### 19. Access with Invalid Token

```
GET {{baseUrl}}/students
Headers:
Authorization: Bearer invalid_token_here
```

❌ Expected: 401 Invalid token

#### 20. Delete Non-Existent Student

```
DELETE {{baseUrl}}/students/9999
Headers:
Authorization: Bearer {{token}}
```

❌ Expected: 404 Student not found

## Expected Response Format

All successful responses follow this format:

```json
{
  "success": true,
  "message": "Operation description",
  "data": { ... },
  "count": 10
}
```

All error responses follow this format:

```json
{
  "success": false,
  "message": "Error description",
  "errors": [ ... ]
}
```

## Status Codes

- `200`: Success
- `201`: Created
- `400`: Bad Request (validation errors)
- `401`: Unauthorized (authentication required)
- `403`: Forbidden (insufficient permissions)
- `404`: Not Found
- `500`: Internal Server Error

## Tips for Testing

1. **Test in Order**: Follow the sequence above for best results
2. **Check Response Status**: Verify the HTTP status code matches expectations
3. **Validate Response Structure**: Ensure responses match the documented format
4. **Test Edge Cases**: Try invalid data, missing fields, etc.
5. **Role Testing**: Test both ADMIN and STUDENT roles
6. **Screenshot Results**: Capture screenshots for documentation

## Sample Postman Collection JSON

You can import this into Postman (save as `postman_collection.json`):

```json
{
  "info": {
    "name": "Student Course Management API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Auth",
      "item": [
        {
          "name": "Admin Login",
          "request": {
            "method": "POST",
            "header": [],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"username\": \"admin\",\n  \"password\": \"admin123\"\n}",
              "options": {
                "raw": {
                  "language": "json"
                }
              }
            },
            "url": {
              "raw": "{{baseUrl}}/auth/login",
              "host": ["{{baseUrl}}"],
              "path": ["auth", "login"]
            }
          }
        }
      ]
    }
  ]
}
```

---

## 🗄️ Testing Stored Procedures (Optional)

If you've installed the stored procedures (`sql/stored_procedures.sql`), you can test them directly in MySQL or through the application.

### Direct MySQL Testing

#### Test Insert Student with Stored Procedure

```sql
-- Insert a student using stored procedure
CALL sp_insert_student_with_course(
    'Test Student SP', 
    'testsp@example.com', 
    1, 
    @student_id, 
    @status, 
    @message
);

-- Check the results
SELECT @student_id as StudentID, @status as Status, @message as Message;

-- Verify the insert
SELECT * FROM students WHERE student_id = @student_id;
```

#### Test Update Student with Stored Procedure

```sql
-- Update student details
CALL sp_update_student_details(
    1, 
    'John Doe Updated', 
    'john.doe.updated@example.com', 
    2, 
    @status, 
    @message
);

-- Check results
SELECT @status as Status, @message as Message;
```

#### Test Get Students by Course

```sql
-- Get all students in course 1
CALL sp_get_students_by_course(1);
```

#### Test Delete Student with Stored Procedure

```sql
-- Delete a student
CALL sp_delete_student(5, @status, @message);

-- Check results
SELECT @status as Status, @message as Message;
```

### Stored Procedure Features

The stored procedures include:

✅ **Built-in Validation:** Course existence, email uniqueness checks  
✅ **Transaction Management:** Automatic rollback on errors  
✅ **Error Handling:** Descriptive status and error messages  
✅ **Data Integrity:** Maintains foreign key relationships

---

## 📦 Import Postman Collection

A complete Postman collection file is included: `postman_collection.json`

### How to Import

1. Open Postman
2. Click **Import** button
3. Select **Upload Files**
4. Choose `postman_collection.json`
5. Collection will appear in your Collections tab

### Collection Features

- ✅ All API endpoints pre-configured
- ✅ Automatic token management
- ✅ Environment variables
- ✅ Request examples with sample data
- ✅ Error case testing
- ✅ Pre-configured headers

### Quick Start with Collection

1. Import the collection
2. Run "Admin Login" request
3. Token is automatically saved
4. Run any other request - token is auto-included
