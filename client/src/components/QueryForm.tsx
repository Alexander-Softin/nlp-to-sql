import React, { useState, useContext } from 'react';
import { AuthContext } from '../App';
import '../css/QueryForm.css';

const QueryForm: React.FC = () => {
  const [naturalLanguageQuery, setNaturalLanguageQuery] = useState('');
  const [sqlQuery, setSqlQuery] = useState('');
  const [message, setMessage] = useState('');

  const { isAuthenticated } = useContext(AuthContext);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    const headers: HeadersInit = { 'Content-Type': 'application/json' };
    if (isAuthenticated && token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const url = isAuthenticated ? 'http://localhost:3001/query' : 'http://localhost:3001/query-unauthed';
    const response = await fetch(url, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({ query: naturalLanguageQuery }),
    });

    const data = await response.json();
    if (response.ok) {
      setSqlQuery(data.sqlQuery);
      setMessage(''); // Очищаем сообщение об ошибке, если запрос успешен
    } else {
      if (data.error) {
        let errorMessage = data.error;
        if (data.timeLeft) {
          errorMessage += ` ${data.timeLeft}`;
        }
        setMessage(errorMessage); // Выводим сообщение об ошибке, если оно есть
      } else {
        setMessage('Произошла ошибка'); // Если сообщение об ошибке от сервера отсутствует, выводим общее сообщение
      }
    }
  };

  return (
    <div className="container">
      <h1>SQL Query Generator</h1>
      <form onSubmit={handleSubmit}>
        <h2>Enter your natural language query:</h2>
        <textarea
          placeholder="Введите запрос на естественном языке"
          value={naturalLanguageQuery}
          onChange={(e) => setNaturalLanguageQuery(e.target.value)}
        />
        <h2>Generated SQL query:</h2>
        <textarea
          placeholder="SQL запрос"
          value={sqlQuery}
          readOnly
        />
        <button type="submit">Отправить</button>
        {message && <p className="message">{message}</p>}
      </form>
    </div>
  );
};

export default QueryForm;
