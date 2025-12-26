import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import StudentList from '../components/admin/StudentList';
import CourseList from '../components/admin/CourseList';
import StudentCourses from '../components/student/StudentCourses';
import api from '../services/api';

const Dashboard = () => {
    const {
        user,
        logout,
        isAdmin,
        displayName,
        studentProfile,
        refreshStudentProfile,
        isProfileLoading
    } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('courses');
    const [adminStats, setAdminStats] = useState({ totalCourses: 0, totalStudents: 0 });
    const [statsLoading, setStatsLoading] = useState(false);

    useEffect(() => {
        if (isAdmin) {
            const loadStats = async () => {
                try {
                    setStatsLoading(true);
                    const [coursesRes, studentsRes] = await Promise.all([
                        api.get('/courses'),
                        api.get('/students')
                    ]);

                    setAdminStats({
                        totalCourses: coursesRes.data.data?.length || 0,
                        totalStudents: studentsRes.data.data?.length || 0
                    });
                } catch (error) {
                    console.error('Failed to load dashboard stats', error);
                } finally {
                    setStatsLoading(false);
                }
            };

            loadStats();
        }
    }, [isAdmin]);

    useEffect(() => {
        if (!isAdmin && !studentProfile) {
            refreshStudentProfile().catch(() => null);
        }
    }, [isAdmin, studentProfile, refreshStudentProfile]);

    const summaryCards = useMemo(() => ([
        {
            label: 'Active Courses',
            value: adminStats.totalCourses,
            caption: 'Total courses available',
            accent: 'accent-sky'
        },
        {
            label: 'Enrolled Students',
            value: adminStats.totalStudents,
            caption: 'Students across all cohorts',
            accent: 'accent-sun'
        }
    ]), [adminStats.totalCourses, adminStats.totalStudents]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="page-shell">
            <div className="dashboard-container">
                <header className="dashboard-header">
                    <div>
                        <p className="eyebrow">{isAdmin ? 'Control Center' : 'Learning Journey'}</p>
                        <h1>Welcome back, {displayName}</h1>
                        <p className="subtitle">{isAdmin ? 'Monitor courses, support students, and keep the catalogue fresh.' : 'Track your enrolled course, stay on pace, and explore what comes next.'}</p>
                    </div>
                    <div className="header-controls">
                        <span className="role-badge">{isAdmin ? 'Admin Portal' : 'Student Portal'}</span>
                        <button onClick={handleLogout} className="btn btn-logout">Logout</button>
                    </div>
                </header>

                <div className="dashboard-content">
                    {isAdmin ? (
                        <>
                            <section className="summary-grid">
                                {summaryCards.map(card => (
                                    <article key={card.label} className={`summary-card ${card.accent}`}>
                                        <p>{card.label}</p>
                                        <h3>{statsLoading ? '—' : card.value}</h3>
                                        <span>{card.caption}</span>
                                    </article>
                                ))}
                            </section>

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
                        </>
                    ) : (
                        <div className="student-panel">
                            <article className="welcome-card">
                                <div>
                                    <p className="eyebrow">Your cohort overview</p>
                                    <h2>{studentProfile?.course_name || 'Enrolled course'}</h2>
                                    <p className="subtitle">
                                        {studentProfile ? 'Keep exploring your modules and stay consistent with the study cadence.' : 'Loading your enrollment details.'}
                                    </p>
                                </div>
                                <div className="chip-stack">
                                    <span className="chip">{user?.role}</span>
                                    {studentProfile?.course_duration && (
                                        <span className="chip">{studentProfile.course_duration} month track</span>
                                    )}
                                </div>
                            </article>

                            <StudentCourses isLoading={isProfileLoading} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
