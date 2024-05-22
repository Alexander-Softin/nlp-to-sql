import React, { useState } from 'react';

const QueryForm: React.FC = () => {
  const [naturalLanguageQuery, setNaturalLanguageQuery] = useState('');
  const [sqlQuery, setSqlQuery] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Здесь будет логика отправки запроса на сервер для преобразования
    // естественного языка в SQL.
    // Пока установим пример результата.
    setSqlQuery(`SELECT * FROM table WHERE query = '${naturalLanguageQuery}'`);
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
      </form>
    </div>
  );
};

export default QueryForm;
