import { useState, useEffect } from 'react';
import api from '../../services/api';

const StudentCourses = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            const response = await api.get('/courses');
            setCourses(response.data.data || []);
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch courses');
            setLoading(false);
        }
    };

    if (loading) return <div>Loading courses...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div>
            <h2>Available Courses</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
                {courses.map(course => (
                    <div key={course.course_id || course.id} style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px', background: 'white' }}>
                        <h3>{course.course_name}</h3>
                        <p style={{ color: '#666', fontWeight: 'bold' }}>Code: {course.course_code}</p>
                        <p>Duration: {course.course_duration}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StudentCourses;
