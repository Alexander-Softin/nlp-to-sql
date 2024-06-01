import React, { useState, createContext, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import Header from './components/Header';
import QueryForm from './components/QueryForm';
import QueryHistory from './components/QueryHistory';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/App.css';
import PurchaseKey from './components/PurchaseKey';
import Footer from './components/Footer';

const AuthContext = createContext({ isAuthenticated: false, setIsAuthenticated: (auth: boolean) => {} });

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedEmail = localStorage.getItem('email');
    if (token) {
      setIsAuthenticated(true);
      setEmail(storedEmail);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
      <div className="app-container">
        <Router>
          <Header email={email} setIsAuthenticated={setIsAuthenticated} />
          <div className="main-content">
            <h1 className="main-title">NLP To SQL</h1>
            <Routes>
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/history" element={<QueryHistory />} />
              <Route path="/purchase-key" element={<PurchaseKey />} />
              <Route path="/" element={<QueryForm />} />
            </Routes>
          </div>
          <Footer />
        </Router>
      </div>
    </AuthContext.Provider>
  );
};

export default App;
export { AuthContext };
