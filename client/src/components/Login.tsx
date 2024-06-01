import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../App';
import '../css/AuthForm.css';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [superUserKey, setSuperUserKey] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const { setIsAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async () => {
    const response = await fetch('http://localhost:3001/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, superUserKey }),
    });

    const data = await response.json();
    if (response.ok) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('email', email);
      setIsAuthenticated(true);
      navigate('/');
      window.location.reload(); // Добавляем перезагрузку страницы
    } else {
      setErrorMessage(data.error);
    }
  };

  return (
    <div className="auth-form-container">
      <h1>Вход</h1>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Пароль"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <input
        type="text"
        placeholder="Суперпользовательский ключ (необязательно)"
        value={superUserKey}
        onChange={(e) => setSuperUserKey(e.target.value)}
      />
      <button onClick={handleLogin}>Войти</button>
    </div>
  );
};

export default Login;
