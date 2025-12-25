const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Student = require('../models/Student');
const Course = require('../models/Course');

class AuthController {
    // POST /login
    static async login(req, res, next) {
        try {
            const { username, password } = req.body;

            // Find user
            const user = await User.findByUsername(username);

            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid username or password'
                });
            }

            // Verify password
            const isPasswordValid = await bcrypt.compare(password, user.password);

            if (!isPasswordValid) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid username or password'
                });
            }

            // Generate JWT token
            const token = jwt.sign(
                { userId: user.user_id, role: user.role },
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRES_IN }
            );

            // Get student details if user is a student
            let studentDetails = null;
            if (user.role === 'STUDENT' && user.student_id) {
                studentDetails = await Student.findById(user.student_id);
            }

            res.status(200).json({
                success: true,
                message: 'Login successful',
                data: {
                    token,
                    user: {
                        userId: user.user_id,
                        username: user.username,
                        role: user.role,
                        studentId: user.student_id
                    },
                    ...(studentDetails && { student: studentDetails })
                }
            });
        } catch (error) {
            next(error);
        }
    }
    // POST /register
    static async register(req, res, next) {
        try {
            const { name, email, course_id, username, password } = req.body;

            // Validate course exists
            const course = await Course.findById(course_id);
            if (!course) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid course. Course does not exist.'
                });
            }

            // Check if email already exists
            const existingStudent = await Student.findByEmail(email);
            if (existingStudent) {
                return res.status(400).json({
                    success: false,
                    message: 'Email already exists'
                });
            }

            // Check if username already exists
            const existingUser = await User.findByUsername(username);
            if (existingUser) {
                return res.status(400).json({
                    success: false,
                    message: 'Username already exists'
                });
            }

            // Create student
            const studentId = await Student.create({
                name,
                email,
                course_id
            });

            // Create user account
            const hashedPassword = await bcrypt.hash(password, 10);
            await User.create({
                username,
                password: hashedPassword,
                role: 'STUDENT',
                student_id: studentId
            });

            // Fetch created student details for token
            const user = await User.findByUsername(username);

            // Generate JWT token
            const token = jwt.sign(
                { userId: user.user_id, role: user.role },
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRES_IN }
            );

            res.status(201).json({
                success: true,
                message: 'Registration successful',
                data: {
                    token,
                    user: {
                        userId: user.user_id,
                        username: user.username,
                        role: user.role,
                        studentId: user.student_id
                    }
                }
            });

        } catch (error) {
            next(error);
        }
    }
}

module.exports = AuthController;
