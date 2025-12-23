const express = require('express');
const CourseController = require('../controllers/courseController');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const { createCourseValidation, updateCourseValidation } = require('../validators/courseValidator');
const validate = require('../middleware/validate');

const router = express.Router();

// Public routes
// GET /api/courses - Get all courses
router.get('/', CourseController.getAllCourses);

// GET /api/courses/:id - Get course by ID
router.get('/:id', CourseController.getCourseById);

// Protected routes (require authentication)
router.use(authenticate);

// POST /api/courses - Add course (Admin only)
router.post(
    '/',
    authorize('ADMIN'),
    createCourseValidation,
    validate,
    CourseController.createCourse
);

// PUT /api/courses/:id - Update course (Admin only)
router.put(
    '/:id',
    authorize('ADMIN'),
    updateCourseValidation,
    validate,
    CourseController.updateCourse
);

// DELETE /api/courses/:id - Delete course (Admin only)
router.delete('/:id', authorize('ADMIN'), CourseController.deleteCourse);

module.exports = router;
