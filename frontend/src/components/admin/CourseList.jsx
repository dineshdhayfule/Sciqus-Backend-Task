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

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this course?')) {
            try {
                await api.delete(`/courses/${id}`);
                fetchCourses();
            } catch (err) {
                alert('Failed to delete course: ' + (err.response?.data?.message || err.message));
            }
        }
    };

    if (loading) return <div>Loading courses...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div>
            <h2>Manage Courses</h2>

            <form onSubmit={handleAddCourse} className="form-card">
                <h3>Add New Course</h3>
                <div className="form-grid">
                    <input
                        placeholder="Course Name"
                        value={newCourse.course_name}
                        onChange={e => setNewCourse({ ...newCourse, course_name: e.target.value })}
                        required
                    />
                    <input
                        placeholder="Course Code"
                        value={newCourse.course_code}
                        onChange={e => setNewCourse({ ...newCourse, course_code: e.target.value })}
                        required
                    />
                    <input
                        placeholder="Duration (months)"
                        type="number"
                        value={newCourse.course_duration}
                        onChange={e => setNewCourse({ ...newCourse, course_duration: e.target.value })}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary">Add Course</button>
            </form>

            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Code</th>
                            <th>Name</th>
                            <th>Duration</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {courses.map(course => (
                            <tr key={course.course_id || course.id}>
                                <td>{course.course_code}</td>
                                <td>{course.course_name}</td>
                                <td>{course.course_duration} months</td>
                                <td>
                                    <button onClick={() => handleDelete(course.course_id || course.id)} className="btn btn-danger btn-sm">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CourseList;
