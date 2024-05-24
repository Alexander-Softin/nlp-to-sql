import React, { useState, createContext} from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './Register';
import Login from './components/Login';
import Header from './components/Header';
import QueryForm from './components/QueryForm';

// Создаем контекст для авторизации
const AuthContext = createContext({ isAuthenticated: false, setIsAuthenticated: (auth: boolean) => {} });

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
      <Router>
        <Header />
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<QueryForm />} />
        </Routes>
      </Router>
    </AuthContext.Provider>
  );
};

export default App;
export { AuthContext };
