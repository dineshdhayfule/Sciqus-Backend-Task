import { useState, useEffect } from 'react';
import api from '../../services/api';

const CourseList = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newCourse, setNewCourse] = useState({ course_name: '', course_code: '', course_duration: '' });

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

    const handleAddCourse = async (e) => {
        e.preventDefault();
        try {
            await api.post('/courses', newCourse);
            setNewCourse({ course_name: '', course_code: '', course_duration: '' });
            fetchCourses(); // Refresh list
        } catch (err) {
            alert('Failed to add course: ' + (err.response?.data?.message || err.message));
        }
    };

    if (loading) return <div>Loading courses...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div>
            <h2>Manage Courses</h2>

            <form onSubmit={handleAddCourse} style={{ marginBottom: '20px', padding: '10px', border: '1px solid #eee', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <div style={{ flex: '1' }}>
                    <input
                        placeholder="Course Name"
                        value={newCourse.course_name}
                        onChange={e => setNewCourse({ ...newCourse, course_name: e.target.value })}
                        required
                        style={{ width: '100%' }}
                    />
                </div>
                <div style={{ flex: '1' }}>
                    <input
                        placeholder="Course Code"
                        value={newCourse.course_code}
                        onChange={e => setNewCourse({ ...newCourse, course_code: e.target.value })}
                        required
                        style={{ width: '100%' }}
                    />
                </div>
                <div style={{ flex: '1' }}>
                    <input
                        placeholder="Duration (e.g. 3 months)"
                        value={newCourse.course_duration}
                        onChange={e => setNewCourse({ ...newCourse, course_duration: e.target.value })}
                        required
                        style={{ width: '100%' }}
                    />
                </div>
                <button type="submit">Add Course</button>
            </form>

            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ textAlign: 'left', backgroundColor: '#f4f4f4' }}>
                        <th style={{ padding: '10px' }}>Code</th>
                        <th style={{ padding: '10px' }}>Name</th>
                        <th style={{ padding: '10px' }}>Duration</th>
                    </tr>
                </thead>
                <tbody>
                    {courses.map(course => (
                        <tr key={course.course_id || course.id} style={{ borderBottom: '1px solid #ddd' }}>
                            <td style={{ padding: '10px' }}>{course.course_code}</td>
                            <td style={{ padding: '10px' }}>{course.course_name}</td>
                            <td style={{ padding: '10px' }}>{course.course_duration}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default CourseList;
