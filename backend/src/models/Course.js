const { pool } = require('../config/database');

class Course {
    // Get all courses
    static async findAll() {
        const [rows] = await pool.query('SELECT * FROM courses ORDER BY course_name');
        return rows;
    }

    // Get course by ID
    static async findById(courseId) {
        const [rows] = await pool.query('SELECT * FROM courses WHERE course_id = ?', [courseId]);
        return rows[0];
    }

    // Get course by code
    static async findByCode(courseCode) {
        const [rows] = await pool.query('SELECT * FROM courses WHERE course_code = ?', [courseCode]);
        return rows[0];
    }

    // Create new course
    static async create(courseData) {
        const { course_name, course_code, course_duration } = courseData;
        const [result] = await pool.query(
            'INSERT INTO courses (course_name, course_code, course_duration) VALUES (?, ?, ?)',
            [course_name, course_code, course_duration]
        );
        return result.insertId;
    }

    // Update course
    static async update(courseId, courseData) {
        const { course_name, course_code, course_duration } = courseData;
        const [result] = await pool.query(
            'UPDATE courses SET course_name = ?, course_code = ?, course_duration = ? WHERE course_id = ?',
            [course_name, course_code, course_duration, courseId]
        );
        return result.affectedRows > 0;
    }

    // Delete course
    static async delete(courseId) {
        const [result] = await pool.query('DELETE FROM courses WHERE course_id = ?', [courseId]);
        return result.affectedRows > 0;
    }

    // ========== STORED PROCEDURE METHODS ==========

    // Create course using stored procedure
    static async createWithProcedure(courseData) {
        const { course_name, course_code, course_duration } = courseData;
        const [result] = await pool.query(
            'CALL sp_insert_course(?, ?, ?, @course_id, @status, @message)',
            [course_name, course_code, course_duration]
        );

        const [output] = await pool.query('SELECT @course_id as courseId, @status as status, @message as message');

        if (output[0].status === 'ERROR') {
            throw new Error(output[0].message);
        }

        return output[0].courseId;
    }

    // Update course using stored procedure
    static async updateWithProcedure(courseId, courseData) {
        const { course_name, course_code, course_duration } = courseData;
        const [result] = await pool.query(
            'CALL sp_update_course(?, ?, ?, ?, @status, @message)',
            [courseId, course_name, course_code, course_duration]
        );

        const [output] = await pool.query('SELECT @status as status, @message as message');

        if (output[0].status === 'ERROR') {
            throw new Error(output[0].message);
        }

        return true;
    }
}

module.exports = Course;
