import axiosInstance from './axiosInstance';

const AuthService = {
    login: async (credentials) => {
        try {
            const response = await axiosInstance.post('/login', credentials); // Замените на свой login endpoint
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
            const response = await axiosInstance.post('/refresh'); // Замените на свой refresh endpoint
            return response.data;
        } catch (error) {
            throw error; //  Пробрасываем ошибку дальше
        }
    },
};

export default AuthService;