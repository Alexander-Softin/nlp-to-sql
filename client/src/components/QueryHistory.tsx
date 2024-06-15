import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../App';
import '../css/QueryForm.css';
import 'bootstrap/dist/css/bootstrap.min.css';

interface RequestLog {
  query: string;
  response: string;
  createdAt: string;
}

const QueryHistory: React.FC = () => {
  const [history, setHistory] = useState<RequestLog[]>([]);
  const { isAuthenticated } = useContext(AuthContext);

  useEffect(() => {
    const fetchHistory = async () => {
      const token = localStorage.getItem('token');
      const response = await fetch('https://nlptosql.back.nikkodev.space/history', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setHistory(data.requestLogs);
    };

    if (isAuthenticated) {
      fetchHistory();
    }
  }, [isAuthenticated]);

 const handleClearHistory = async () => {
    const token = localStorage.getItem('token');
    const response = await fetch('https://nlptosql.back.nikkodev.space/history', {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (response.ok) {
      setHistory([]);
      alert(data.message);
    } else {
      alert(data.error);
    }
  };

  return (
    <div className="container mt-4">
      <h2>История запросов</h2>
      <div className="list-group mb-4">
        {history.map((log, index) => (
          <div key={index} className="list-group-item">
            <p><strong>Запрос:</strong> {log.query}</p>
            <p><strong>Ответ:</strong> {log.response}</p>
            <p><small><strong>Дата:</strong> {new Date(log.createdAt).toLocaleString()}</small></p>
          </div>
        ))}
      </div>
      {history.length > 0 && (
        <button onClick={handleClearHistory} className="btn btn-danger">Очистить историю</button>
      )}
    </div>
  );
};


export default QueryHistory;
