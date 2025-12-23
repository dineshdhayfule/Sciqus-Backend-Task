const Course = require('../models/Course');
const Student = require('../models/Student');

class CourseController {
    // POST /courses - Add new course
    static async createCourse(req, res, next) {
        try {
            const { course_name, course_code, course_duration } = req.body;

            // Check if course code already exists
            const existingCourse = await Course.findByCode(course_code);
            if (existingCourse) {
                return res.status(400).json({
                    success: false,
                    message: 'Course code already exists'
                });
            }

            // Create course
            const courseId = await Course.create({
                course_name,
                course_code,
                course_duration
            });

            // Fetch created course
            const course = await Course.findById(courseId);

            res.status(201).json({
                success: true,
                message: 'Course created successfully',
                data: course
            });
        } catch (error) {
            next(error);
        }
    }

    // GET /courses - Get all courses
    static async getAllCourses(req, res, next) {
        try {
            const courses = await Course.findAll();

            res.status(200).json({
                success: true,
                message: 'Courses retrieved successfully',
                data: courses,
                count: courses.length
            });
        } catch (error) {
            next(error);
        }
    }

    // GET /courses/:id - Get course by ID
    static async getCourseById(req, res, next) {
        try {
            const { id } = req.params;
            const course = await Course.findById(id);

            if (!course) {
                return res.status(404).json({
                    success: false,
                    message: 'Course not found'
                });
            }

            res.status(200).json({
                success: true,
                message: 'Course retrieved successfully',
                data: course
            });
        } catch (error) {
            next(error);
        }
    }

    // PUT /courses/:id - Update course
    static async updateCourse(req, res, next) {
        try {
            const { id } = req.params;
            const { course_name, course_code, course_duration } = req.body;

            // Check if course exists
            const existingCourse = await Course.findById(id);
            if (!existingCourse) {
                return res.status(404).json({
                    success: false,
                    message: 'Course not found'
                });
            }

            // Check if new course code conflicts with another course
            if (course_code !== existingCourse.course_code) {
                const duplicateCourse = await Course.findByCode(course_code);
                if (duplicateCourse) {
                    return res.status(400).json({
                        success: false,
                        message: 'Course code already exists'
                    });
                }
            }

            // Update course
            await Course.update(id, {
                course_name,
                course_code,
                course_duration
            });

            // Fetch updated course
            const updatedCourse = await Course.findById(id);

            res.status(200).json({
                success: true,
                message: 'Course updated successfully',
                data: updatedCourse
            });
        } catch (error) {
            next(error);
        }
    }

    // DELETE /courses/:id - Delete course
    static async deleteCourse(req, res, next) {
        try {
            const { id } = req.params;

            // Check if course exists
            const course = await Course.findById(id);
            if (!course) {
                return res.status(404).json({
                    success: false,
                    message: 'Course not found'
                });
            }

            // Check if any students are enrolled in this course
            const students = await Student.findByCourseId(id);
            if (students.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Cannot delete course. Students are enrolled in this course.'
                });
            }

            // Delete course
            await Course.delete(id);

            res.status(200).json({
                success: true,
                message: 'Course deleted successfully'
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = CourseController;
