
import React, {
    useState,
    useEffect
} from 'react'
import axiosInstance from '../api/axiosInstance';
const Dashboard = () => {

    const [data, setData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axiosInstance.get('/classification'); // Замените на свой API endpoint
                setData(response.data);
            } catch (error) {
                setError(error);
            }
        };

        fetchData();
    }, []);

    if (error && error.response?.status === 403) {
        return < div > Доступ запрещен. </div>; // Или любой другой UI для 403 ошибки
    }

    if (error) {
        return < div > Ошибка: {
            error.message
        } </div>; // Обработка других ошибок
    }

    if (!data) {
        return < div > Loading... </div>;
    }
    return (<div>
        < h2 > Dashboard </h2> <p > Welcome to your dashboard! </p> </div>
    );
};

export default Dashboard;