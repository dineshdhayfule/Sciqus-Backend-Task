import { useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const demoAccounts = useMemo(() => ([
        { role: 'Admin', username: 'admin', password: 'admin123' },
        { role: 'Student', username: 'john.doe', password: 'student123' }
    ]), []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const result = await login(username, password);

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
                    <p className="eyebrow">Access the portal</p>
                    <h2>Sign in</h2>
                    <p className="subtitle">Use your assigned credentials to manage courses or follow your study track.</p>

                    <form onSubmit={handleSubmit} className="stack">
                        {error && <div className="form-alert">{error}</div>}
                        <label htmlFor="username">Username</label>
                        <input
                            id="username"
                            name="username"
                            type="text"
                            autoComplete="username"
                            placeholder="e.g. admin"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                        <label htmlFor="password">Password</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <button type="submit" className="btn btn-primary">Enter Dashboard</button>
                    </form>

                    <p className="auth-switch">
                        Need a student profile? <Link to="/register">Register here</Link>
                    </p>
                </section>

                <aside className="auth-side">
                    <h3>Demo credentials</h3>
                    <p>Quickly explore both admin and student journeys.</p>
                    <ul>
                        {demoAccounts.map((account) => (
                            <li key={account.role}>
                                <span>{account.role}</span>
                                <code>{account.username} / {account.password}</code>
                            </li>
                        ))}
                    </ul>
                </aside>
            </div>
        </div>
    );
};

export default Login;
