const { body } = require('express-validator');

// Validation rules for creating a course
const createCourseValidation = [
    body('course_name')
        .trim()
        .notEmpty()
        .withMessage('Course name is required')
        .isLength({ min: 3, max: 255 })
        .withMessage('Course name must be between 3 and 255 characters'),
    body('course_code')
        .trim()
        .notEmpty()
        .withMessage('Course code is required')
        .isLength({ min: 2, max: 50 })
        .withMessage('Course code must be between 2 and 50 characters')
        .matches(/^[A-Z0-9_-]+$/i)
        .withMessage('Course code can only contain letters, numbers, hyphens and underscores'),
    body('course_duration')
        .notEmpty()
        .withMessage('Course duration is required')
        .isInt({ min: 1, max: 120 })
        .withMessage('Course duration must be between 1 and 120 months')
];

// Validation rules for updating a course
const updateCourseValidation = createCourseValidation;

module.exports = {
    createCourseValidation,
    updateCourseValidation
};
