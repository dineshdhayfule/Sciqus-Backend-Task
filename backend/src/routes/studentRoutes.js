const express = require('express');
const StudentController = require('../controllers/studentController');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const { createStudentValidation, updateStudentValidation } = require('../validators/studentValidator');
const validate = require('../middleware/validate');

const router = express.Router();

// All student routes require authentication
router.use(authenticate);

// GET /api/students/me - Student views their own details
router.get('/me', authorize('STUDENT'), StudentController.getMyDetails);

// GET /api/students/course/:courseId - Get students by course (Admin only)
router.get('/course/:courseId', authorize('ADMIN'), StudentController.getStudentsByCourse);

// POST /api/students - Add student (Admin only)
router.post(
    '/',
    authorize('ADMIN'),
    createStudentValidation,
    validate,
    StudentController.createStudent
);

// GET /api/students - Get all students (Admin only)
router.get('/', authorize('ADMIN'), StudentController.getAllStudents);

// GET /api/students/:id - Get student by ID (Admin only)
router.get('/:id', authorize('ADMIN'), StudentController.getStudentById);

// PUT /api/students/:id - Update student (Admin only)
router.put(
    '/:id',
    authorize('ADMIN'),
    updateStudentValidation,
    validate,
    StudentController.updateStudent
);

// DELETE /api/students/:id - Delete student (Admin only)
router.delete('/:id', authorize('ADMIN'), StudentController.deleteStudent);

module.exports = router;
