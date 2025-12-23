const { body } = require('express-validator');

// Validation rules for creating a student
const createStudentValidation = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Name is required')
        .isLength({ min: 2, max: 255 })
        .withMessage('Name must be between 2 and 255 characters'),
    body('email')
        .trim()
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Please provide a valid email address')
        .normalizeEmail(),
    body('course_id')
        .notEmpty()
        .withMessage('Course ID is required')
        .isInt({ min: 1 })
        .withMessage('Course ID must be a valid number'),
    body('username')
        .optional()
        .trim()
        .isLength({ min: 3, max: 100 })
        .withMessage('Username must be between 3 and 100 characters'),
    body('password')
        .optional()
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long')
];

// Validation rules for updating a student
const updateStudentValidation = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Name is required')
        .isLength({ min: 2, max: 255 })
        .withMessage('Name must be between 2 and 255 characters'),
    body('email')
        .trim()
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Please provide a valid email address')
        .normalizeEmail(),
    body('course_id')
        .notEmpty()
        .withMessage('Course ID is required')
        .isInt({ min: 1 })
        .withMessage('Course ID must be a valid number')
];

module.exports = {
    createStudentValidation,
    updateStudentValidation
};
