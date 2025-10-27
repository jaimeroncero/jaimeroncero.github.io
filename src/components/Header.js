import { useNavigate } from 'react-router-dom';
import './Header.css';

function Header({ title }) {
  const navigate = useNavigate();

  return (
    <header className="new-app-header">
      <button onClick={() => navigate(-1)} className="header-btn back-btn">
        <span>&larr;</span> Atrás
      </button>
      <h1 className="header-title">{title}</h1>
      <button onClick={() => navigate('/')} className="header-btn home-btn">
        <span>&#8962;</span> Inicio
      </button>
    </header>
  );
}

export default Header;
