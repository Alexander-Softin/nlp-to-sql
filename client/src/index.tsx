import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import './css/App.css';
import App from './App';

const rootElement = document.getElementById("application");

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  rootElement
);
