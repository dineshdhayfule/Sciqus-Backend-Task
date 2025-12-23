-- Create Database
CREATE DATABASE IF NOT EXISTS student_course_db;
USE student_course_db;
-- Course Table
CREATE TABLE IF NOT EXISTS courses (
    course_id INT PRIMARY KEY AUTO_INCREMENT,
    course_name VARCHAR(255) NOT NULL,
    course_code VARCHAR(50) NOT NULL UNIQUE,
    course_duration INT NOT NULL COMMENT 'Duration in months',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
-- User Table (for Authentication)
CREATE TABLE IF NOT EXISTS users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('ADMIN', 'STUDENT') NOT NULL DEFAULT 'STUDENT',
    student_id INT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
-- Student Table
CREATE TABLE IF NOT EXISTS students (
    student_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    course_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES courses(course_id) ON DELETE RESTRICT ON UPDATE CASCADE
);
-- Add foreign key constraint from users to students
ALTER TABLE users
ADD CONSTRAINT fk_user_student FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE
SET NULL ON UPDATE CASCADE;
-- Insert sample courses
INSERT INTO courses (course_name, course_code, course_duration)
VALUES ('Computer Science', 'CS101', 48),
    ('Data Science', 'DS201', 36),
    ('Web Development', 'WD301', 24),
    ('Mobile App Development', 'MAD401', 30);
-- Insert admin user (password: admin123)
INSERT INTO users (username, password, role, student_id)
VALUES (
        'admin',
        '$2a$10$rZ5L7xKJ8qKGz7wW7XqN0eYQXZ5g1h7X8qX9tY5K7mN8oP6rQ4sT2',
        'ADMIN',
        NULL
    );
-- Insert sample students
INSERT INTO students (name, email, course_id)
VALUES ('John Doe', 'john.doe@example.com', 1),
    ('Jane Smith', 'jane.smith@example.com', 2),
    ('Bob Johnson', 'bob.johnson@example.com', 1);
-- Insert student users (password: student123)
INSERT INTO users (username, password, role, student_id)
VALUES (
        'john.doe',
        '$2a$10$rZ5L7xKJ8qKGz7wW7XqN0eYQXZ5g1h7X8qX9tY5K7mN8oP6rQ4sT2',
        'STUDENT',
        1
    ),
    (
        'jane.smith',
        '$2a$10$rZ5L7xKJ8qKGz7wW7XqN0eYQXZ5g1h7X8qX9tY5K7mN8oP6rQ4sT2',
        'STUDENT',
        2
    ),
    (
        'bob.johnson',
        '$2a$10$rZ5L7xKJ8qKGz7wW7XqN0eYQXZ5g1h7X8qX9tY5K7mN8oP6rQ4sT2',
        'STUDENT',
        3
    );