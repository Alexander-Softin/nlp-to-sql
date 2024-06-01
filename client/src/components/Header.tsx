import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar, Nav } from 'react-bootstrap';

interface HeaderProps {
  email: string | null;
  setIsAuthenticated: (auth: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ email, setIsAuthenticated }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    setIsAuthenticated(false);
    navigate('/');
    window.location.reload(); // Добавляем перезагрузку страницы
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Navbar.Brand href="/">SQL Generator</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="ml-auto">
          {email ? (
            <>
              <Nav.Link disabled>Привет, {email}</Nav.Link>
              <Nav.Link href="/purchase-key">Купить ключ</Nav.Link>
              <Nav.Link onClick={handleLogout}>Выйти</Nav.Link>
            </>
          ) : (
            <>
              <Nav.Link href="/login">Вход</Nav.Link>
              <Nav.Link href="/register">Регистрация</Nav.Link>
            </>
          )}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Header;
