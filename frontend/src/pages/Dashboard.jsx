import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import StudentList from '../components/admin/StudentList';
import CourseList from '../components/admin/CourseList';
import StudentCourses from '../components/student/StudentCourses';

const Dashboard = () => {
    const { user, logout, isAdmin } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('courses');

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <h1>Welcome, {user?.name}</h1>
                <div className="header-controls">
                    <span className="role-badge">{isAdmin ? 'Admin Portal' : 'Student Portal'}</span>
                    <button onClick={handleLogout} className="btn btn-logout">Logout</button>
                </div>
            </header>

            <div className="dashboard-content">
                {isAdmin ? (
                    <div className="admin-panel">
                        <div className="tabs">
                            <button
                                onClick={() => setActiveTab('courses')}
                                className={`tab-btn ${activeTab === 'courses' ? 'active' : ''}`}
                            >
                                Manage Courses
                            </button>
                            <button
                                onClick={() => setActiveTab('students')}
                                className={`tab-btn ${activeTab === 'students' ? 'active' : ''}`}
                            >
                                Manage Students
                            </button>
                        </div>

                        <div className="tab-content">
                            {activeTab === 'students' ? <StudentList /> : <CourseList />}
                        </div>
                    </div>
                ) : (
                    <div className="student-panel">
                        <StudentCourses />
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
