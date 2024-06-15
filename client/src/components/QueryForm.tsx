import React, { useState, useContext } from 'react';
import { AuthContext } from '../App';
import '../css/QueryForm.css';

const QueryForm: React.FC = () => {
  const [naturalLanguageQuery, setNaturalLanguageQuery] = useState('');
  const [sqlQuery, setSqlQuery] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const { isAuthenticated } = useContext(AuthContext);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!naturalLanguageQuery.trim()) {
      setMessage('Поле для ввода запроса на естественном языке не может быть пустым');
      return;
    }
    setLoading(true);
    setMessage('');

    try {
      const token = localStorage.getItem('token');
      const headers: HeadersInit = { 'Content-Type': 'application/json' };
      if (isAuthenticated && token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const url = isAuthenticated ? 'https://nlptosql.back.nikkodev.space/query' : 'https://nlptosql.back.nikkodev.space/query-unauthed';
      const response = await fetch(url, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({ query: naturalLanguageQuery }),
      });

      const data = await response.json();
      if (response.ok) {
        setSqlQuery(data.sqlQuery);
        setMessage('');
      } else {
        setMessage(data.error + ` ${data.timeLeft}`|| 'Произошла ошибка');
      }
    } catch (error) {
      setMessage('Произошла ошибка');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <form onSubmit={handleSubmit} className="form-container">
        <div className="form-group">
          <textarea
            placeholder="Введите запрос на естественном языке"
            value={naturalLanguageQuery}
            onChange={(e) => setNaturalLanguageQuery(e.target.value)}
            disabled={loading}
          />
        </div>
        <button
          type="submit"
          className="generate-button"
          disabled={loading || !naturalLanguageQuery.trim()}
        >
          Сгенерировать запрос
        </button>
        <div className="form-group">
          <textarea
            placeholder={loading ? "Запрос генерируется..." : "SQL запрос"}
            value={loading ? "" : sqlQuery}
            readOnly
          />
          {loading && (
            <div className="loading-overlay">
              <div className="loading-spinner"></div>
            </div>
          )}
        </div>
      </form>
      {message && <div className="alert alert-danger message">{message}</div>}
    </div>
  );
};

export default QueryForm;
