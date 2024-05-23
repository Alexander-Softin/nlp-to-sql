import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../App';

const QueryForm: React.FC = () => {
  const [naturalLanguageQuery, setNaturalLanguageQuery] = useState('');
  const [sqlQuery, setSqlQuery] = useState('');
  const [message, setMessage] = useState('');
  const [requestCount, setRequestCount] = useState(0);

  const { isAuthenticated } = useContext(AuthContext);
  const maxRequests = isAuthenticated ? 3 : 1;

  useEffect(() => {
    const storedRequestCount = localStorage.getItem('requestCount');
    if (storedRequestCount) {
      setRequestCount(parseInt(storedRequestCount));
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (requestCount >= maxRequests) {
      setMessage(`Вы достигли максимального количества запросов: ${maxRequests}`);
      return;
    }

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
      setRequestCount(requestCount + 1);
      localStorage.setItem('requestCount', String(requestCount + 1));
      setMessage('');
    } else {
      setMessage(data.error);
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '20px' }}>
      <form onSubmit={handleSubmit}>
        <div>
          <textarea
            placeholder="Введите запрос на естественном языке"
            value={naturalLanguageQuery}
            onChange={(e) => setNaturalLanguageQuery(e.target.value)}
            style={{ width: '80%', height: '100px', marginBottom: '20px' }}
          />
        </div>
        <div>
          <textarea
            placeholder="SQL запрос"
            value={sqlQuery}
            readOnly
            style={{ width: '80%', height: '100px', marginBottom: '20px' }}
          />
        </div>
        <button type="submit">Отправить</button>
        <p>{message}</p>
      </form>
    </div>
  );
};

export default QueryForm;
