import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

const Register = () => {
    const { register: registerUser } = useAuth();
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
        const fetchCourses = async () => {
            try {
                const response = await api.get('/courses');
                setCourses(response.data.data || []);
            } catch (err) {
                setError('Unable to load course catalogue.');
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

        if (!formData.course_id) {
            setError('Please select a course');
            return;
        }

        const result = await registerUser(formData);

        if (result.success) {
            navigate('/dashboard');
        } else {
            setError(result.message);
        }
    };

    return (
        <div className="auth-wrapper">
            <div className="auth-card">
                <section className="auth-panel">
                    <p className="eyebrow">Start learning</p>
                    <h2>Create your student profile</h2>
                    <p className="subtitle">Pick a course, receive dashboard access, and begin tracking your progress.</p>

                    <form onSubmit={handleSubmit} className="stack">
                        {error && <div className="form-alert">{error}</div>}
                        <label htmlFor="name">Full name</label>
                        <input
                            id="name"
                            type="text"
                            name="name"
                            autoComplete="name"
                            placeholder="Ada Lovelace"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            type="email"
                            name="email"
                            autoComplete="email"
                            placeholder="ada@example.com"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                        <label htmlFor="username">Username</label>
                        <input
                            id="username"
                            type="text"
                            name="username"
                            autoComplete="username"
                            placeholder="ada.lovelace"
                            value={formData.username}
                            onChange={handleChange}
                            required
                        />
                        <label htmlFor="password">Password</label>
                        <input
                            id="password"
                            type="password"
                            name="password"
                            autoComplete="new-password"
                            placeholder="Create a secure password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                        <label htmlFor="course_id">Select a course</label>
                        <select
                            id="course_id"
                            name="course_id"
                            value={formData.course_id}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Choose from catalogue</option>
                            {courses.map(course => (
                                <option key={course.course_id || course.id} value={course.course_id || course.id}>
                                    {course.course_name}
                                </option>
                            ))}
                        </select>

                        <button type="submit" className="btn btn-primary">Create account</button>
                    </form>

                    <p className="auth-switch">
                        Already registered? <Link to="/login">Sign in</Link>
                    </p>
                </section>

                <aside className="auth-side">
                    <h3>What you get</h3>
                    <ul>
                        <li><span>Personalized dashboard</span><p>Track enrollment details & timelines.</p></li>
                        <li><span>Secure login</span><p>Role-based access backed by JWT auth.</p></li>
                        <li><span>Course catalogue</span><p>Switch between cohorts with admin support.</p></li>
                    </ul>
                </aside>
            </div>
        </div>
    );
};

export default Register;
