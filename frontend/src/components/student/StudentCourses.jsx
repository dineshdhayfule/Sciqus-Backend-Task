import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const StudentCourses = ({ isLoading = false }) => {
    const { studentProfile, refreshStudentProfile } = useAuth();
    const [error, setError] = useState('');

    useEffect(() => {
        if (!studentProfile) {
            refreshStudentProfile().catch(() => setError('Failed to fetch your details. Please try again.'));
        }
    }, [studentProfile, refreshStudentProfile]);

    if (isLoading) {
        return (
            <div className="card subtle-card">
                <p>Loading your profile...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="card error-card">
                <p>{error}</p>
            </div>
        );
    }

    if (!studentProfile) {
        return null;
    }

    return (
        <div>
            <h2>My Profile & Course</h2>
            <div className="card">
                <div className="card-section">
                    <h3>Student Details</h3>
                    <p><strong>Name:</strong> {studentProfile.name}</p>
                    <p><strong>Email:</strong> {studentProfile.email}</p>
                </div>

                <div className="card-section">
                    <h3>Enrolled Course</h3>
                    <div className="course-card">
                        <h4>{studentProfile.course_name}</h4>
                        <p><strong>Code:</strong> {studentProfile.course_code}</p>
                        <p><strong>Duration:</strong> {studentProfile.course_duration} months</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentCourses;
