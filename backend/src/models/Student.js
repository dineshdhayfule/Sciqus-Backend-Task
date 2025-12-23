const { pool } = require('../config/database');

class Student {
    // Get all students with course details
    static async findAll() {
        const [rows] = await pool.query(`
            SELECT 
                s.student_id, s.name, s.email, s.course_id,
                c.course_name, c.course_code, c.course_duration,
                s.created_at, s.updated_at
            FROM students s
            INNER JOIN courses c ON s.course_id = c.course_id
            ORDER BY s.name
        `);
        return rows;
    }

    // Get student by ID with course details
    static async findById(studentId) {
        const [rows] = await pool.query(`
            SELECT 
                s.student_id, s.name, s.email, s.course_id,
                c.course_name, c.course_code, c.course_duration,
                s.created_at, s.updated_at
            FROM students s
            INNER JOIN courses c ON s.course_id = c.course_id
            WHERE s.student_id = ?
        `, [studentId]);
        return rows[0];
    }

    // Get student by email
    static async findByEmail(email) {
        const [rows] = await pool.query('SELECT * FROM students WHERE email = ?', [email]);
        return rows[0];
    }

    // Get students by course ID
    static async findByCourseId(courseId) {
        const [rows] = await pool.query(`
            SELECT 
                s.student_id, s.name, s.email, s.course_id,
                c.course_name, c.course_code, c.course_duration,
                s.created_at, s.updated_at
            FROM students s
            INNER JOIN courses c ON s.course_id = c.course_id
            WHERE s.course_id = ?
            ORDER BY s.name
        `, [courseId]);
        return rows;
    }

    // Create new student
    static async create(studentData) {
        const { name, email, course_id } = studentData;
        const [result] = await pool.query(
            'INSERT INTO students (name, email, course_id) VALUES (?, ?, ?)',
            [name, email, course_id]
        );
        return result.insertId;
    }

    // Update student
    static async update(studentId, studentData) {
        const { name, email, course_id } = studentData;
        const [result] = await pool.query(
            'UPDATE students SET name = ?, email = ?, course_id = ? WHERE student_id = ?',
            [name, email, course_id, studentId]
        );
        return result.affectedRows > 0;
    }

    // Delete student
    static async delete(studentId) {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();

            // Delete associated user account
            await connection.query('DELETE FROM users WHERE student_id = ?', [studentId]);

            // Delete student
            const [result] = await connection.query('DELETE FROM students WHERE student_id = ?', [studentId]);

            await connection.commit();
            return result.affectedRows > 0;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    // ========== STORED PROCEDURE METHODS ==========

    // Create student using stored procedure
    static async createWithProcedure(studentData) {
        const { name, email, course_id } = studentData;
        const [result] = await pool.query(
            'CALL sp_insert_student_with_course(?, ?, ?, @student_id, @status, @message)',
            [name, email, course_id]
        );

        const [output] = await pool.query('SELECT @student_id as studentId, @status as status, @message as message');

        if (output[0].status === 'ERROR') {
            throw new Error(output[0].message);
        }

        return output[0].studentId;
    }

    // Update student using stored procedure
    static async updateWithProcedure(studentId, studentData) {
        const { name, email, course_id } = studentData;
        const [result] = await pool.query(
            'CALL sp_update_student_details(?, ?, ?, ?, @status, @message)',
            [studentId, name, email, course_id]
        );

        const [output] = await pool.query('SELECT @status as status, @message as message');

        if (output[0].status === 'ERROR') {
            throw new Error(output[0].message);
        }

        return true;
    }

    // Delete student using stored procedure
    static async deleteWithProcedure(studentId) {
        const [result] = await pool.query(
            'CALL sp_delete_student(?, @status, @message)',
            [studentId]
        );

        const [output] = await pool.query('SELECT @status as status, @message as message');

        if (output[0].status === 'ERROR') {
            throw new Error(output[0].message);
        }

        return true;
    }

    // Get students by course using stored procedure
    static async findByCourseWithProcedure(courseId) {
        const [rows] = await pool.query('CALL sp_get_students_by_course(?)', [courseId]);
        return rows[0]; // First result set contains the data
    }
}

module.exports = Student;
