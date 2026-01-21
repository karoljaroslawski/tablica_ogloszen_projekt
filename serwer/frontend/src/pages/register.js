import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';

import '../styles/authStyles.css';

import Header from './header';
import { sendError, sendSuccess, sendWarning } from '../components/toast';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const navigate=useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if(!formData.username||!formData.email||!formData.phone||!formData.password||!formData.confirmPassword){
      sendWarning("Wszystkie pola są wymagane");
      return;
    }
    
    if(formData.password.length<4){
      sendError("Hasło zbyt krótkie");
      return;
    }

    const regex = /^[a-zA-Z0-9\_\.]{3}[a-zA-Z0-9\_\.]*\@[a-zA-Z0-9\_\.]{3}[a-zA-Z0-9\_\.]*$/;
    if(!regex.test(formData.email)){
      sendError("Niepoprawny email");
      return;
    }
    const phoneRegex=/^[0-9]{9}$/
    if(!phoneRegex.test(formData.phone)){
      sendError("Niepoprawny numer telefonu");
      return;
    }

    if(formData.password!==formData.confirmPassword){
      sendError("Hasła muszą się zgadzać");
      return;
    }
      try {
        const response = await axios.post('/api/register', formData);
        if (response.status==201) {
          sendSuccess("Rejestracja pomyślna");
          navigate("/");
        } else {
          sendError(response.data.message || 'Błędne dane');
        }
      } catch (err) {
        sendError(err.response.data.message)
      }

  };

  return (
    <div>
    <Header/>
    <div className="authContainer">
      <div className="authCard">
        <h2>Stwórz konto</h2>
        
        <form>
          <div className="formGroup">
            <label>Nazwa użytkownika</label>
            <input 
              type="username" 
              name="username"
              placeholder="np. jan_kowanlski" 
              onChange={handleChange}
              required
            />
          </div>
          <div className="formGroup">
            <label>Adres e-mail</label>
            <input 
              type="email" 
              name="email"
              placeholder="np. jan.kowalski@poczta.pl" 
              onChange={handleChange}
              required
            />
          </div>

          <div className="formGroup">
            <label>Numer telefonu</label>
            <input 
              type="tel" 
              name="phone"
              placeholder="np. 123456789" 
              onChange={handleChange}
              required
            />
          </div>

          <div className="formGroup">
            <label>Hasło</label>
            <input 
              type="password" 
              name="password"
              placeholder="Wpisz hasło" 
              onChange={handleChange}
              required
            />
          </div>

          <div className="formGroup">
            <label>Powtórz hasło</label>
            <input 
              type="password" 
              name="confirmPassword"
              placeholder="Wpisz hasło ponownie" 
              onChange={handleChange}
              required
            />
          </div>

          <button className="authBtn" onClick={handleSubmit}>Zarejestruj się</button>
        </form>

        <div className="authFooter">
          Masz już konto? <a href="/login">Zaloguj się</a>
        </div>
      </div>
    </div>
    </div>
  );
};

export default RegisterPage;