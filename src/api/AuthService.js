import axiosInstance from './axiosInstance';
import axios from 'axios';

const axiosRefresh = axios.create({
    baseURL: 'http://localhost:8080', // Замените на свой backend URL
    withCredentials: true,
});

const AuthService = {
    login: async (credentials) => {
        try {
            const response = await axiosInstance.post(`/login?login=${credentials.username}`, {'password': credentials.password}); // Замените на свой login endpoint
            return response.data;
        } catch (error) {
            throw error; //  Пробрасываем ошибку дальше
        }
    },
    logout: async () => {
        try {
            await axiosInstance.post('/logout'); // Замените на свой logout endpoint
            return {
                success: true
            };
        } catch (error) {
            throw error; //  Пробрасываем ошибку дальше
        }
    },
    refresh: async () => {
        try {
            const response = await axiosRefresh.post('/refresh'); // Замените на свой refresh endpoint
            return response.data;
        } catch (error) {
            throw error; //  Пробрасываем ошибку дальше
        }
    },
};

export default AuthService;