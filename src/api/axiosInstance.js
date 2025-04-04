import axios from 'axios';
import AuthService from './AuthService';

let isRefreshingToken = false;
let pendingRequests = [];

const axiosInstance = axios.create({
    baseURL: 'http://localhost:8080', // Замените на свой backend URL
    withCredentials: true,
});

axiosInstance.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem('access_token');
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            console.log('401 ошибка!');
            if (isRefreshingToken) {
                // Если токен уже обновляется, добавляем запрос в очередь
                return new Promise((resolve) => {
                    pendingRequests.push(() => {
                        originalRequest.headers.Authorization = `Bearer ${localStorage.getItem('access_token')}`;
                        resolve(axiosInstance(originalRequest));
                    });
                });
            }

            isRefreshingToken = true;
            try {
                const refreshResponse = await AuthService.refresh();
                console.log(refreshResponse)
                if (refreshResponse && refreshResponse.success && refreshResponse.data.access_token) {

                    const newAccessToken = refreshResponse.data.access_token;
                    localStorage.setItem('access_token', newAccessToken);
                    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

                    // Запускаем все ожидающие запросы
                    pendingRequests.forEach((callback) => callback());
                    pendingRequests = [];

                    return axiosInstance(originalRequest);
                } else {
                    console.log(refreshResponse.error)
                    localStorage.removeItem('access_token');
                    // window.location.href = '/login';
                    return Promise.reject(new Error('Token refresh failed'));
                }
            } catch (refreshError) {
                console.error('Ошибка при обновлении токена:', refreshError);
                localStorage.removeItem('access_token');
                window.location.href = '/login';
                return Promise.reject(refreshError);
            } finally {
                isRefreshingToken = false;
            }
        }

        if (error.response?.status === 403) {
            const accessToken = localStorage.getItem('access_token');
            if (accessToken) {
                console.error('Доступ запрещен (403)');
                alert('Доступ запрещен. У вас нет прав для просмотра этой страницы.');
            }
            else {
                window.location.href = '/login';
            }
            
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;