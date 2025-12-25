import { useState, useEffect } from 'react';
import api from '../../services/api';

const StudentList = () => {
    const [students, setStudents] = useState([]);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // Add Form State
    const [newStudent, setNewStudent] = useState({
        name: '',
        email: '',
        username: '',
        password: '',
        course_id: ''
    });

    // Edit Form State
    const [editingId, setEditingId] = useState(null);
    const [editFormData, setEditFormData] = useState({
        name: '',
        email: '',
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

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this student? This will also delete their user account.')) {
            try {
                await api.delete(`/students/${id}`);
                fetchData();
            } catch (err) {
                alert('Failed to delete student: ' + (err.response?.data?.message || err.message));
            }
        }
    };

    const startEdit = (student) => {
        setEditingId(student.student_id || student.id);
        setEditFormData({
            name: student.name,
            email: student.email,
            course_id: student.course_id
        });
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditFormData({ name: '', email: '', course_id: '' });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/students/${editingId}`, editFormData);
            setEditingId(null);
            fetchData();
        } catch (err) {
            alert('Failed to update student: ' + (err.response?.data?.message || err.message));
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div>
            <h2>Manage Students</h2>

            {/* Add Student Form */}
            <form onSubmit={handleAddStudent} className="form-card">
                <h3>Add New Student</h3>
                <div className="form-grid">
                    <input
                        placeholder="Full Name"
                        value={newStudent.name}
                        onChange={e => setNewStudent({ ...newStudent, name: e.target.value })}
                        required
                    />
                    <input
                        placeholder="Email"
                        type="email"
                        value={newStudent.email}
                        onChange={e => setNewStudent({ ...newStudent, email: e.target.value })}
                        required
                    />
                    <input
                        placeholder="Username"
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
                    >
                        <option value="">Select Course</option>
                        {courses.map(course => (
                            <option key={course.course_id || course.id} value={course.course_id || course.id}>
                                {course.course_name} ({course.course_code})
                            </option>
                        ))}
                    </select>
                </div>
                <button type="submit" className="btn btn-primary">Add Student</button>
            </form>

            {/* Student List Table */}
            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Course</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.map(student => (
                            <tr key={student.student_id || student.id}>
                                {editingId === (student.student_id || student.id) ? (
                                    // Edit Mode
                                    <>
                                        <td>
                                            <input 
                                                value={editFormData.name} 
                                                onChange={e => setEditFormData({...editFormData, name: e.target.value})}
                                            />
                                        </td>
                                        <td>
                                            <input 
                                                value={editFormData.email} 
                                                onChange={e => setEditFormData({...editFormData, email: e.target.value})}
                                            />
                                        </td>
                                        <td>
                                            <select 
                                                value={editFormData.course_id} 
                                                onChange={e => setEditFormData({...editFormData, course_id: e.target.value})}
                                            >
                                                {courses.map(course => (
                                                    <option key={course.course_id || course.id} value={course.course_id || course.id}>
                                                        {course.course_name}
                                                    </option>
                                                ))}
                                            </select>
                                        </td>
                                        <td>
                                            <button onClick={handleUpdate} className="btn btn-primary btn-sm">Save</button>
                                            <button onClick={cancelEdit} className="btn btn-secondary btn-sm">Cancel</button>
                                        </td>
                                    </>
                                ) : (
                                    // View Mode
                                    <>
                                        <td>{student.name}</td>
                                        <td>{student.email}</td>
                                        <td>
                                            {student.course_name || courses.find(c => (c.course_id || c.id) === student.course_id)?.course_name || student.course_id}
                                        </td>
                                        <td>
                                            <button onClick={() => startEdit(student)} className="btn btn-warning btn-sm">Edit</button>
                                            <button onClick={() => handleDelete(student.student_id || student.id)} className="btn btn-danger btn-sm">Delete</button>
                                        </td>
                                    </>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default StudentList;
