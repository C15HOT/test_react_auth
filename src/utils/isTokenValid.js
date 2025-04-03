import {jwtDecode} from "jwt-decode";

function isTokenValid(token) {
    if (!token) {
        return false;
    }
    try {
        const decoded = jwtDecode(token);
        const currentTime = Math.floor(Date.now() / 1000);
        return decoded.exp > currentTime;
    } catch (error) {
        console.error('Error decoding token:', error);
        return false;
    }
}
export default isTokenValid;