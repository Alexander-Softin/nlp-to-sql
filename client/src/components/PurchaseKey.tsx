import React, { useState } from 'react';
import '../css/AuthForm.css';

const PurchaseKey: React.FC = () => {
  const [superUserKey, setSuperUserKey] = useState<string | null>(null);

  const handlePurchase = async () => {
    const token = localStorage.getItem('token');
    const response = await fetch('http://localhost:3001/generate-key', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();
    if (response.ok) {
      setSuperUserKey(data.superUserKey);
    } else {
      alert(data.error);
    }
  };

  return (
    <div className="auth-form-container">
      <h1>Покупка ключа суперпользователя</h1>
      <p>Здесь можно приобрести ключ суперпользователя для безлимитного использования запросов.</p>
      <button className="btn btn-success" onClick={handlePurchase}>Купить ключ за $9.99</button>
      {superUserKey && (
        <div className="mt-3">
          <p>Ваш ключ суперпользователя:</p>
          <div className="alert alert-info">
            <strong>{superUserKey}</strong>
          </div>
          <button
            className="btn btn-primary"
            onClick={() => navigator.clipboard.writeText(superUserKey)}
          >
            Скопировать ключ
          </button>
        </div>
      )}
    </div>
  );
};

export default PurchaseKey;
