import { createContext, useState, useEffect, useContext, useCallback, useRef } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [studentProfile, setStudentProfile] = useState(null);
    const [initializing, setInitializing] = useState(true);
    const [profileLoading, setProfileLoading] = useState(false);
    const userRef = useRef(null);

    useEffect(() => {
        userRef.current = user;
    }, [user]);

    const fetchStudentProfile = useCallback(async (targetUser) => {
        const activeUser = targetUser || userRef.current;
        if (!activeUser || activeUser.role !== 'STUDENT') {
            setStudentProfile(null);
            return null;
        }

        try {
            setProfileLoading(true);
            const response = await api.get('/students/me');
            setStudentProfile(response.data.data);
            return response.data.data;
        } catch (error) {
            console.error('Failed to load student profile', error);
            setStudentProfile(null);
            throw error;
        } finally {
            setProfileLoading(false);
        }
    }, []);

    useEffect(() => {
        const bootstrap = async () => {
            const token = localStorage.getItem('token');
            const storedUser = localStorage.getItem('user');

            if (token && storedUser) {
                const parsedUser = JSON.parse(storedUser);
                setUser(parsedUser);

                if (parsedUser.role === 'STUDENT') {
                    try {
                        await fetchStudentProfile(parsedUser);
                    } catch (error) {
                        console.error('Failed to hydrate profile', error);
                    }
                }
            }

            setInitializing(false);
        };

        bootstrap();
    }, [fetchStudentProfile]);

    const login = async (username, password) => {
        try {
            const response = await api.post('/auth/login', { username, password });
            const { token, user: nextUser, student } = response.data.data;

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(nextUser));
            setUser(nextUser);
            setStudentProfile(student || null);
            return { success: true };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Login failed'
            };
        }
    };

    const register = async (data) => {
        try {
            const response = await api.post('/auth/register', data);
            const { token, user: nextUser } = response.data.data;

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(nextUser));
            setUser(nextUser);
            try {
                await fetchStudentProfile(nextUser);
            } catch (error) {
                console.error('Profile fetch failed after registration', error);
            }
            return { success: true };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Registration failed'
            };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        setStudentProfile(null);
    };

    const displayName = studentProfile?.name || user?.username || 'Guest';

    const value = {
        user,
        studentProfile,
        login,
        register,
        logout,
        refreshStudentProfile: fetchStudentProfile,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'ADMIN',
        isInitializing: initializing,
        isProfileLoading: profileLoading,
        displayName
    };

    return (
        <AuthContext.Provider value={value}>
            {!initializing && children}
        </AuthContext.Provider>
    );
};
