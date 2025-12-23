import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

const Register = () => {
    const { register } = useAuth();
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        username: '',
        password: '',
        course_id: ''
    });
    const [error, setError] = useState('');

    useEffect(() => {
        // Fetch courses for dropdown
        const fetchCourses = async () => {
            try {
                const response = await api.get('/courses');
                setCourses(response.data.data || []);
            } catch (err) {
                console.error("Failed to fetch courses", err);
            }
        };
        fetchCourses();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Basic validation
        if (!formData.course_id) {
            setError('Please calculate a course');
            return;
        }

        const result = await register(formData);

        if (result.success) {
            navigate('/dashboard');
        } else {
            setError(result.message);
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column' }}>
            <h2>Create Student Account</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', width: '350px', gap: '10px' }}>
                {error && <div style={{ color: 'red', textAlign: 'center' }}>{error}</div>}

                <input
                    id="name"
                    type="text"
                    name="name"
                    autoComplete="name"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    style={{ padding: '8px' }}
                />
                <input
                    id="email"
                    type="email"
                    name="email"
                    autoComplete="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    style={{ padding: '8px' }}
                />
                <input
                    id="username"
                    type="text"
                    name="username"
                    autoComplete="username"
                    placeholder="Username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    style={{ padding: '8px' }}
                />
                <input
                    id="password"
                    type="password"
                    name="password"
                    autoComplete="new-password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    style={{ padding: '8px' }}
                />

                <select
                    id="course_id"
                    name="course_id"
                    value={formData.course_id}
                    onChange={handleChange}
                    required
                    style={{ padding: '8px' }}
                >
                    <option value="">Select a Course</option>
                    {courses.map(course => (
                        <option key={course.course_id || course.id} value={course.course_id || course.id}>
                            {course.course_name}
                        </option>
                    ))}
                </select>

                <button type="submit" style={{ padding: '10px', cursor: 'pointer', backgroundColor: '#28a745', color: 'white', border: 'none' }}>Register</button>
            </form>
            <p style={{ marginTop: '15px' }}>
                Already have an account? <Link to="/login">Login here</Link>
            </p>
        </div>
    );
};

export default Register;
