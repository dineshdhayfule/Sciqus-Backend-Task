-- Stored Procedures for Student Course Management System
USE student_course_db;
-- Drop procedures if they exist
DROP PROCEDURE IF EXISTS sp_insert_student_with_course;
DROP PROCEDURE IF EXISTS sp_update_student_details;
DROP PROCEDURE IF EXISTS sp_delete_student;
DROP PROCEDURE IF EXISTS sp_get_students_by_course;
DROP PROCEDURE IF EXISTS sp_insert_course;
DROP PROCEDURE IF EXISTS sp_update_course;
-- =====================================================
-- Procedure: sp_insert_student_with_course
-- Description: Insert a new student with course assignment
-- Validates that course exists before inserting
-- =====================================================
DELIMITER // CREATE PROCEDURE sp_insert_student_with_course(
    IN p_name VARCHAR(255),
    IN p_email VARCHAR(255),
    IN p_course_id INT,
    OUT p_student_id INT,
    OUT p_status VARCHAR(20),
    OUT p_message VARCHAR(255)
) BEGIN
DECLARE course_exists INT DEFAULT 0;
DECLARE email_exists INT DEFAULT 0;
DECLARE EXIT HANDLER FOR SQLEXCEPTION BEGIN ROLLBACK;
SET p_status = 'ERROR';
SET p_message = 'An error occurred while inserting student';
SET p_student_id = NULL;
END;
START TRANSACTION;
-- Check if course exists
SELECT COUNT(*) INTO course_exists
FROM courses
WHERE course_id = p_course_id;
IF course_exists = 0 THEN
SET p_status = 'ERROR';
SET p_message = 'Invalid course ID. Course does not exist.';
SET p_student_id = NULL;
ROLLBACK;
ELSE -- Check if email already exists
SELECT COUNT(*) INTO email_exists
FROM students
WHERE email = p_email;
IF email_exists > 0 THEN
SET p_status = 'ERROR';
SET p_message = 'Email already exists';
SET p_student_id = NULL;
ROLLBACK;
ELSE -- Insert student
INSERT INTO students (name, email, course_id)
VALUES (p_name, p_email, p_course_id);
SET p_student_id = LAST_INSERT_ID();
SET p_status = 'SUCCESS';
SET p_message = 'Student created successfully';
COMMIT;
END IF;
END IF;
END // DELIMITER;
-- =====================================================
-- Procedure: sp_update_student_details
-- Description: Update student details including course reassignment
-- Validates new course exists before updating
-- =====================================================
DELIMITER // CREATE PROCEDURE sp_update_student_details(
    IN p_student_id INT,
    IN p_name VARCHAR(255),
    IN p_email VARCHAR(255),
    IN p_course_id INT,
    OUT p_status VARCHAR(20),
    OUT p_message VARCHAR(255)
) BEGIN
DECLARE student_exists INT DEFAULT 0;
DECLARE course_exists INT DEFAULT 0;
DECLARE email_conflict INT DEFAULT 0;
DECLARE EXIT HANDLER FOR SQLEXCEPTION BEGIN ROLLBACK;
SET p_status = 'ERROR';
SET p_message = 'An error occurred while updating student';
END;
START TRANSACTION;
-- Check if student exists
SELECT COUNT(*) INTO student_exists
FROM students
WHERE student_id = p_student_id;
IF student_exists = 0 THEN
SET p_status = 'ERROR';
SET p_message = 'Student not found';
ROLLBACK;
ELSE -- Check if course exists
SELECT COUNT(*) INTO course_exists
FROM courses
WHERE course_id = p_course_id;
IF course_exists = 0 THEN
SET p_status = 'ERROR';
SET p_message = 'Invalid course ID. Course does not exist.';
ROLLBACK;
ELSE -- Check if email conflicts with another student
SELECT COUNT(*) INTO email_conflict
FROM students
WHERE email = p_email
    AND student_id != p_student_id;
IF email_conflict > 0 THEN
SET p_status = 'ERROR';
SET p_message = 'Email already exists for another student';
ROLLBACK;
ELSE -- Update student
UPDATE students
SET name = p_name,
    email = p_email,
    course_id = p_course_id
WHERE student_id = p_student_id;
SET p_status = 'SUCCESS';
SET p_message = 'Student updated successfully';
COMMIT;
END IF;
END IF;
END IF;
END // DELIMITER;
-- =====================================================
-- Procedure: sp_delete_student
-- Description: Delete student record and associated user account
-- Handles course relationship properly
-- =====================================================
DELIMITER // CREATE PROCEDURE sp_delete_student(
    IN p_student_id INT,
    OUT p_status VARCHAR(20),
    OUT p_message VARCHAR(255)
) BEGIN
DECLARE student_exists INT DEFAULT 0;
DECLARE EXIT HANDLER FOR SQLEXCEPTION BEGIN ROLLBACK;
SET p_status = 'ERROR';
SET p_message = 'An error occurred while deleting student';
END;
START TRANSACTION;
-- Check if student exists
SELECT COUNT(*) INTO student_exists
FROM students
WHERE student_id = p_student_id;
IF student_exists = 0 THEN
SET p_status = 'ERROR';
SET p_message = 'Student not found';
ROLLBACK;
ELSE -- Delete associated user account first
DELETE FROM users
WHERE student_id = p_student_id;
-- Delete student
DELETE FROM students
WHERE student_id = p_student_id;
SET p_status = 'SUCCESS';
SET p_message = 'Student deleted successfully';
COMMIT;
END IF;
END // DELIMITER;
-- =====================================================
-- Procedure: sp_get_students_by_course
-- Description: Retrieve all students enrolled in a specific course
-- =====================================================
DELIMITER // CREATE PROCEDURE sp_get_students_by_course(IN p_course_id INT) BEGIN
SELECT s.student_id,
    s.name,
    s.email,
    s.course_id,
    c.course_name,
    c.course_code,
    c.course_duration,
    s.created_at,
    s.updated_at
FROM students s
    INNER JOIN courses c ON s.course_id = c.course_id
WHERE s.course_id = p_course_id
ORDER BY s.name;
END // DELIMITER;
-- =====================================================
-- Procedure: sp_insert_course
-- Description: Insert a new course with validation
-- =====================================================
DELIMITER // CREATE PROCEDURE sp_insert_course(
    IN p_course_name VARCHAR(255),
    IN p_course_code VARCHAR(50),
    IN p_course_duration INT,
    OUT p_course_id INT,
    OUT p_status VARCHAR(20),
    OUT p_message VARCHAR(255)
) BEGIN
DECLARE code_exists INT DEFAULT 0;
DECLARE EXIT HANDLER FOR SQLEXCEPTION BEGIN ROLLBACK;
SET p_status = 'ERROR';
SET p_message = 'An error occurred while inserting course';
SET p_course_id = NULL;
END;
START TRANSACTION;
-- Check if course code already exists
SELECT COUNT(*) INTO code_exists
FROM courses
WHERE course_code = p_course_code;
IF code_exists > 0 THEN
SET p_status = 'ERROR';
SET p_message = 'Course code already exists';
SET p_course_id = NULL;
ROLLBACK;
ELSE -- Insert course
INSERT INTO courses (course_name, course_code, course_duration)
VALUES (p_course_name, p_course_code, p_course_duration);
SET p_course_id = LAST_INSERT_ID();
SET p_status = 'SUCCESS';
SET p_message = 'Course created successfully';
COMMIT;
END IF;
END // DELIMITER;
-- =====================================================
-- Procedure: sp_update_course
-- Description: Update course details with validation
-- =====================================================
DELIMITER // CREATE PROCEDURE sp_update_course(
    IN p_course_id INT,
    IN p_course_name VARCHAR(255),
    IN p_course_code VARCHAR(50),
    IN p_course_duration INT,
    OUT p_status VARCHAR(20),
    OUT p_message VARCHAR(255)
) BEGIN
DECLARE course_exists INT DEFAULT 0;
DECLARE code_conflict INT DEFAULT 0;
DECLARE EXIT HANDLER FOR SQLEXCEPTION BEGIN ROLLBACK;
SET p_status = 'ERROR';
SET p_message = 'An error occurred while updating course';
END;
START TRANSACTION;
-- Check if course exists
SELECT COUNT(*) INTO course_exists
FROM courses
WHERE course_id = p_course_id;
IF course_exists = 0 THEN
SET p_status = 'ERROR';
SET p_message = 'Course not found';
ROLLBACK;
ELSE -- Check if course code conflicts with another course
SELECT COUNT(*) INTO code_conflict
FROM courses
WHERE course_code = p_course_code
    AND course_id != p_course_id;
IF code_conflict > 0 THEN
SET p_status = 'ERROR';
SET p_message = 'Course code already exists for another course';
ROLLBACK;
ELSE -- Update course
UPDATE courses
SET course_name = p_course_name,
    course_code = p_course_code,
    course_duration = p_course_duration
WHERE course_id = p_course_id;
SET p_status = 'SUCCESS';
SET p_message = 'Course updated successfully';
COMMIT;
END IF;
END IF;
END // DELIMITER;
-- =====================================================
-- Test the stored procedures
-- =====================================================
-- Test sp_insert_student_with_course
-- CALL sp_insert_student_with_course('Test Student', 'test@example.com', 1, @student_id, @status, @message);
-- SELECT @student_id, @status, @message;
-- Test sp_get_students_by_course
-- CALL sp_get_students_by_course(1);
-- Test sp_update_student_details
-- CALL sp_update_student_details(1, 'Updated Name', 'updated@example.com', 2, @status, @message);
-- SELECT @status, @message;
-- Test sp_delete_student
-- CALL sp_delete_student(1, @status, @message);
-- SELECT @status, @message;