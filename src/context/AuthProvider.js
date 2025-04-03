import React, {
    createContext,
    useState,
    useEffect,
    useCallback,
    useContext
} from 'react';
import {
    useNavigate
} from 'react-router-dom';
import AuthService from '../api/AuthService';
import isTokenValid from '../utils/isTokenValid';

const AuthContext = createContext();

export const AuthProvider = ({
    children
}) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [initialized, setInitialized] = useState(false);
    const navigate = useNavigate();

    const login = useCallback(async (credentials) => {
            const response = await AuthService.login(credentials);
            if (response.success) {
                localStorage.setItem('access_token', response.data.access_token);
                setIsLoggedIn(true);
                navigate('/protected'); // Замените на свой protected route
                return true;
            }
            return false;
        },
        [navigate]);

    const logout = useCallback(async () => {
            await AuthService.logout();
            localStorage.removeItem('access_token');
            setIsLoggedIn(false);
            navigate('/login');
        },
        [navigate]);

    const refreshAccessToken = useCallback(async () => {
            try {
                const response = await AuthService.refresh();
                if (response.success && response.data.access_token) {
                    localStorage.setItem('access_token', response.data.access_token);
                    setIsLoggedIn(true);
                    return true;
                } else {
                    localStorage.removeItem('access_token');
                    setIsLoggedIn(false);
                    return false;
                }
            } catch (error) {
                console.error('Ошибка при обновлении токена:', error);
                localStorage.removeItem('access_token');
                setIsLoggedIn(false);
                return false;
            }
        },
        [navigate]);

    useEffect(() => {
            const accessToken = localStorage.getItem('access_token');
            if (accessToken) {
                if (isTokenValid(accessToken)) {
                    setIsLoggedIn(true);
                } else {
                    refreshAccessToken();
                }
            } else {
                setIsLoggedIn(false);
            }
            setInitialized(true);
        },
        [refreshAccessToken]);

    const value = {
        isLoggedIn,
        login,
        logout,
        refreshAccessToken,
        initialized,
    };

    return ( <AuthContext.Provider value = {value}> {
            initialized ? children : <div> Loading... </div>} </AuthContext.Provider>
        );
    };

    export const useAuth = () => {
        return useContext(AuthContext);
    };