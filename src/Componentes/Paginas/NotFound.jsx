// src/Componentes/Paginas/NotFound.jsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './NotFound.css';

const NotFound = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/Home');
    }, 3000); // redirige después de 5 segundos

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="notfound-container">
      <h1>404</h1>
      <p>Oops... Esta página no existe.</p>
      <img 
        src="https://media.giphy.com/media/jpbnoe3UIa8TU8LM13/giphy.gif" 
        alt="404 gif triste"
        className="notfound-gif"
      />
      <p>Serás redirigido al inicio de sesión en 5 segundos.</p>
    </div>
  );
};

export default NotFound;
