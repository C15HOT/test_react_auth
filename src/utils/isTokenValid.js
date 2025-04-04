import {jwtDecode} from "jwt-decode";


const formatTokenExpiration = (exp) => {
    const currentTime = Date.now() / 1000; // Время в секундах
    const timeDifference = exp - currentTime;

    if (timeDifference > 0) {
        // Токен еще не истек
        const hours = Math.floor(timeDifference / 3600);
        const minutes = Math.floor((timeDifference % 3600) / 60);
        const seconds = Math.floor(timeDifference % 60);
        return `Токен истечет через ${hours} ч ${minutes} м ${seconds} с`;
    } else {
        // Токен истек
        const hours = Math.floor(-timeDifference / 3600);
        const minutes = Math.floor((-timeDifference % 3600) / 60);
        const seconds = Math.floor(-timeDifference % 60);
        return `Токен истек ${hours} ч ${minutes} м ${seconds} с назад`;
    }
};

  const isTokenValid = (token) => {
    try {
      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000; // Время в секундах

      // Проверяем, не истек ли токен
      if (decodedToken.exp < currentTime) {
        console.log(formatTokenExpiration(decodedToken.exp));
        return false;
      }
      console.log(formatTokenExpiration(decodedToken.exp));
      return true;
    } catch (error) {
      console.error('Ошибка при декодировании токена:', error);
      return false;
    }
  };
export default isTokenValid;