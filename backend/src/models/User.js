const { pool } = require('../config/database');

class User {
    // Find user by username
    static async findByUsername(username) {
        const [rows] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
        return rows[0];
    }

    // Find user by ID
    static async findById(userId) {
        const [rows] = await pool.query('SELECT * FROM users WHERE user_id = ?', [userId]);
        return rows[0];
    }

    // Create new user
    static async create(userData) {
        const { username, password, role, student_id } = userData;
        const [result] = await pool.query(
            'INSERT INTO users (username, password, role, student_id) VALUES (?, ?, ?, ?)',
            [username, password, role, student_id || null]
        );
        return result.insertId;
    }

    // Update user
    static async update(userId, userData) {
        const { username, password, role, student_id } = userData;
        const [result] = await pool.query(
            'UPDATE users SET username = ?, password = ?, role = ?, student_id = ? WHERE user_id = ?',
            [username, password, role, student_id || null, userId]
        );
        return result.affectedRows > 0;
    }

    // Delete user
    static async delete(userId) {
        const [result] = await pool.query('DELETE FROM users WHERE user_id = ?', [userId]);
        return result.affectedRows > 0;
    }
}

module.exports = User;
