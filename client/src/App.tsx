import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './Register';
import Login from './components/Login';
import Header from './components/Header';
import QueryForm from './components/QueryForm';

const App: React.FC = () => {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<QueryForm />} />
      </Routes>
    </Router>
  );
};

export default App;
