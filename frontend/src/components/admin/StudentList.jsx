import { useState, useEffect } from 'react';
import api from '../../services/api';

const StudentList = () => {
    const [students, setStudents] = useState([]);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newStudent, setNewStudent] = useState({
        name: '',
        email: '',
        username: '',
        password: '',
        course_id: ''
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [studentsRes, coursesRes] = await Promise.all([
                api.get('/students'),
                api.get('/courses')
            ]);
            setStudents(studentsRes.data.data || []);
            setCourses(coursesRes.data.data || []);
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch data');
            setLoading(false);
        }
    };

    const handleAddStudent = async (e) => {
        e.preventDefault();
        try {
            await api.post('/students', newStudent);
            setNewStudent({ name: '', email: '', username: '', password: '', course_id: '' });
            fetchData(); // Refresh list
        } catch (err) {
            alert('Failed to add student: ' + (err.response?.data?.message || err.message));
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div>
            <h2>Manage Students</h2>

            <form onSubmit={handleAddStudent} style={{ marginBottom: '20px', padding: '10px', border: '1px solid #eee', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <h3>Add New Student</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <input
                        placeholder="Full Name"
                        value={newStudent.name}
                        onChange={e => setNewStudent({ ...newStudent, name: e.target.value })}
                        required
                    />
                    <input
                        placeholder="Email"
                        value={newStudent.email}
                        onChange={e => setNewStudent({ ...newStudent, email: e.target.value })}
                        required
                    />
                    <input
                        placeholder="Username (for login)"
                        value={newStudent.username}
                        onChange={e => setNewStudent({ ...newStudent, username: e.target.value })}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={newStudent.password}
                        onChange={e => setNewStudent({ ...newStudent, password: e.target.value })}
                        required
                    />
                    <select
                        value={newStudent.course_id}
                        onChange={e => setNewStudent({ ...newStudent, course_id: e.target.value })}
                        required
                        style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                    >
                        <option value="">Select Course</option>
                        {courses.map(course => (
                            <option key={course.course_id || course.id} value={course.course_id || course.id}>
                                {course.course_name} ({course.course_code})
                            </option>
                        ))}
                    </select>
                </div>
                <button type="submit" style={{ alignSelf: 'flex-start', marginTop: '10px' }}>Add Student</button>
            </form>

            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ textAlign: 'left', backgroundColor: '#f4f4f4' }}>
                        <th style={{ padding: '10px' }}>ID</th>
                        <th style={{ padding: '10px' }}>Name</th>
                        <th style={{ padding: '10px' }}>Email</th>
                        <th style={{ padding: '10px' }}>Course ID</th>
                    </tr>
                </thead>
                <tbody>
                    {students.map(student => (
                        <tr key={student.student_id || student.id} style={{ borderBottom: '1px solid #ddd' }}>
                            <td style={{ padding: '10px' }}>{student.student_id || student.id}</td>
                            <td style={{ padding: '10px' }}>{student.name}</td>
                            <td style={{ padding: '10px' }}>{student.email}</td>
                            <td style={{ padding: '10px' }}>{student.course_id}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default StudentList;
