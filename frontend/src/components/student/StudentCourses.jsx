import { useState, useEffect } from 'react';
import api from '../../services/api';

const StudentCourses = () => {
    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchMyDetails();
    }, []);

    const fetchMyDetails = async () => {
        try {
            const response = await api.get('/students/me');
            setStudent(response.data.data);
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch your details');
            setLoading(false);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;
    if (!student) return <div>No student data found</div>;

    return (
        <div>
            <h2>My Profile & Course</h2>
            <div className="card">
                <div className="card-section">
                    <h3>Student Details</h3>
                    <p><strong>Name:</strong> {student.name}</p>
                    <p><strong>Email:</strong> {student.email}</p>
                </div>
                
                <div className="card-section">
                    <h3>Enrolled Course</h3>
                    <div className="course-card">
                        <h4>{student.course_name}</h4>
                        <p><strong>Code:</strong> {student.course_code}</p>
                        <p><strong>Duration:</strong> {student.course_duration} months</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentCourses;
