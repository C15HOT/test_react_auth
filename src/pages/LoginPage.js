import React, {
    useState
} from 'react';
import {
    useAuth
} from '../context/AuthProvider';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const {
        login
    } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        await login({
            username,
            password
        });
    };

    return (<div><h2> Login </h2> <form onSubmit={
        handleSubmit
    }>
        <input type="text"
            placeholder="Username"
            value={
                username
            }
            onChange={
                (e) => setUsername(e.target.value)
            } />
        <input type="password"
            placeholder="Password"
            value={
                password
            }
            onChange={
                (e) => setPassword(e.target.value)
            } /> <button type="submit" > Login </button> </form> </div>
    );
};

export default LoginPage;