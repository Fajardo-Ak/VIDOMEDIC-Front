import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function OAuthCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    const user  = searchParams.get('user'); // puede venir o no

    if (token) {
      localStorage.setItem('token', token);

      // si viene user (JSON stringificado) lo guardamos, si no lo omitimos
      if (user) {
        localStorage.setItem('user', user);
      }

      // misma navegación que ya usabas
      navigate('/dashboard');
    } else {
      navigate('/login?error=oauth_failed');
    }
  }, [navigate, searchParams]);

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h2>Procesando login...</h2>
      <p>Por favor espera</p>
    </div>
  );
}
