const bcrypt = require('bcryptjs');
const Student = require('../models/Student');
const Course = require('../models/Course');
const User = require('../models/User');

class StudentController {
    // POST /students - Add new student with course
    static async createStudent(req, res, next) {
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

            // Check if username already exists (if provided)
            if (username) {
                const existingUser = await User.findByUsername(username);
                if (existingUser) {
                    return res.status(400).json({
                        success: false,
                        message: 'Username already exists'
                    });
                }
            }

            // Create student
            const studentId = await Student.create({
                name,
                email,
                course_id
            });

            // Create user account if username and password provided
            if (username && password) {
                const hashedPassword = await bcrypt.hash(password, 10);
                await User.create({
                    username,
                    password: hashedPassword,
                    role: 'STUDENT',
                    student_id: studentId
                });
            }

            // Fetch created student with course details
            const student = await Student.findById(studentId);

            res.status(201).json({
                success: true,
                message: 'Student created successfully',
                data: student
            });
        } catch (error) {
            next(error);
        }
    }

    // GET /students - Get all students with course details
    static async getAllStudents(req, res, next) {
        try {
            const students = await Student.findAll();

            res.status(200).json({
                success: true,
                message: 'Students retrieved successfully',
                data: students,
                count: students.length
            });
        } catch (error) {
            next(error);
        }
    }

    // GET /students/:id - Get student by ID
    static async getStudentById(req, res, next) {
        try {
            const { id } = req.params;
            const student = await Student.findById(id);

            if (!student) {
                return res.status(404).json({
                    success: false,
                    message: 'Student not found'
                });
            }

            res.status(200).json({
                success: true,
                message: 'Student retrieved successfully',
                data: student
            });
        } catch (error) {
            next(error);
        }
    }

    // PUT /students/:id - Update student and change course
    static async updateStudent(req, res, next) {
        try {
            const { id } = req.params;
            const { name, email, course_id } = req.body;

            // Check if student exists
            const existingStudent = await Student.findById(id);
            if (!existingStudent) {
                return res.status(404).json({
                    success: false,
                    message: 'Student not found'
                });
            }

            // Validate course exists
            const course = await Course.findById(course_id);
            if (!course) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid course. Course does not exist.'
                });
            }

            // Check if new email conflicts with another student
            if (email !== existingStudent.email) {
                const duplicateStudent = await Student.findByEmail(email);
                if (duplicateStudent) {
                    return res.status(400).json({
                        success: false,
                        message: 'Email already exists'
                    });
                }
            }

            // Update student
            await Student.update(id, {
                name,
                email,
                course_id
            });

            // Fetch updated student
            const updatedStudent = await Student.findById(id);

            res.status(200).json({
                success: true,
                message: 'Student updated successfully',
                data: updatedStudent
            });
        } catch (error) {
            next(error);
        }
    }

    // DELETE /students/:id - Delete student
    static async deleteStudent(req, res, next) {
        try {
            const { id } = req.params;

            // Check if student exists
            const student = await Student.findById(id);
            if (!student) {
                return res.status(404).json({
                    success: false,
                    message: 'Student not found'
                });
            }

            // Delete student (this will also delete associated user account)
            await Student.delete(id);

            res.status(200).json({
                success: true,
                message: 'Student deleted successfully'
            });
        } catch (error) {
            next(error);
        }
    }

    // GET /students/course/:courseId - Get students by course
    static async getStudentsByCourse(req, res, next) {
        try {
            const { courseId } = req.params;

            // Validate course exists
            const course = await Course.findById(courseId);
            if (!course) {
                return res.status(404).json({
                    success: false,
                    message: 'Course not found'
                });
            }

            const students = await Student.findByCourseId(courseId);

            res.status(200).json({
                success: true,
                message: 'Students retrieved successfully',
                data: students,
                count: students.length,
                course: {
                    course_id: course.course_id,
                    course_name: course.course_name,
                    course_code: course.course_code
                }
            });
        } catch (error) {
            next(error);
        }
    }

    // GET /me - Get logged-in student's own details
    static async getMyDetails(req, res, next) {
        try {
            const { studentId, role } = req.user;

            // Only students can access this endpoint
            if (role !== 'STUDENT' || !studentId) {
                return res.status(403).json({
                    success: false,
                    message: 'This endpoint is only accessible to students'
                });
            }

            const student = await Student.findById(studentId);

            if (!student) {
                return res.status(404).json({
                    success: false,
                    message: 'Student profile not found'
                });
            }

            res.status(200).json({
                success: true,
                message: 'Your details retrieved successfully',
                data: student
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = StudentController;
