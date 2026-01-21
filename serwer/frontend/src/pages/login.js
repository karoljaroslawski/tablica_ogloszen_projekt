import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';

import '../styles/authStyles.css';

import Header from './header';
import { sendError, sendSuccess } from '../components/toast';

const LoginPage = () => {
    const [formData, setFormData] = useState({
        username: "",
        password: ""
    });
    const [error, setError] = useState('');

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!formData.username || !formData.password) {
            sendError("Wszystkie pola są wymagane");
            return;
        }

        try {
            const response = await axios.post('/api/login', formData);
            if (response.status == 200) {
                const data = response.data;
                localStorage.setItem('token', data.token);
                localStorage.setItem('idUser', data.idUser);
                localStorage.setItem('username', data.username);
                localStorage.setItem('email', data.email);
                localStorage.setItem('isLogged',true);
                localStorage.setItem('isAdmin',data.idRole==1?true:false);
                sendSuccess("Zalogowano pomyślnie");
                navigate("/");
            }else {
                sendError(response.data.message || 'Błędny e-mail lub hasło');
            }
        } catch (err) {
            sendError(err.response.data.message)
        }
    };

    return (
        <div>
            <Header />
            <div className="authContainer">
                <div className="authCard">
                    <h2>Zaloguj się</h2>
                    <form>
                        <div className="formGroup">
                            <label>Nazwa użytkownika</label>
                            <input type="text" name="username" placeholder="nazwa_uzytkownika" onChange={handleChange} required />
                        </div>
                        <div className="formGroup">
                            <label>Hasło</label>
                            <input type="password" name="password" placeholder="••••••••" onChange={handleChange} required />
                        </div>
                        <button className="authBtn" onClick={handleSubmit}>Zaloguj się</button>
                    </form>
                    <div className="authFooter">
                        Nie masz konta? <a href="/register">Zarejestruj się</a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;