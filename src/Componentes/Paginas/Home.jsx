// src/pages/Home.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return (
    <div className="home-container">
      {/* Sección Hero */}
      <header className="hero-section">
        <div className="hero-content">
          <h1>Vidomedi - Gestión Inteligente de Medicamentos</h1>
          <p>La solución perfecta para el cuidado de adultos mayores. Control de medicamentos, alarmas y notificaciones para tutores.</p>
          <div className="hero-buttons">
            <Link to="/registro" className="btn btn-primary">Crear Cuenta</Link>
            <Link to="/login" className="btn btn-secondary">Iniciar Sesión</Link>
          </div>
        </div>
        <div className="hero-image">
          <div className="medicine-icon">💊</div>
          <div className="notification-icon">🔔</div>
          <div className="calendar-icon">📅</div>
          <div className="contact-icon">👨‍⚕️</div>
        </div>
      </header>

      {/* Características Principales */}
      <section className="features-section">
        <h2>¿Por qué elegir Vidomedi?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">⏰</div>
            <h3>Alarmas Inteligentes</h3>
            <p>Recordatorios automáticos para cada dosis de medicamento, nunca más olvides una toma.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📱</div>
            <h3>Notificaciones a Tutores</h3>
            <p>Alertas instantáneas a familiares o cuidadores cuando se toma o se omite un medicamento.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Historial Completo</h3>
            <p>Registro detallado de todas las tomas con fecha, hora y dosis para un seguimiento preciso.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">👨‍👩‍👧</div>
            <h3>Contactos de Emergencia</h3>
            <p>Acceso rápido a todos los contactos importantes en caso de necesidad.</p>
          </div>
        </div>
      </section>

      {/* Cómo Funciona */}
      <section className="how-it-works">
        <h2>Así de simple es usar Vidomedi</h2>
        <div className="steps-container">
          <div className="step">
            <div className="step-number">1</div>
            <div className="step-content">
              <h3>Registra los medicamentos</h3>
              <p>Agrega todos los medicamentos con sus dosis y horarios específicos.</p>
            </div>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <div className="step-content">
              <h3>Configura las alarmas</h3>
              <p>Establece recordatorios para cada toma y notificaciones para los tutores.</p>
            </div>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <div className="step-content">
              <h3>Mantén el control</h3>
              <p>Sigue el historial de tomas y recibe alertas sobre cualquier incidencia.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonios */}
      <section className="testimonials">
        <h2>Lo que dicen nuestros usuarios</h2>
        <div className="testimonials-grid">
          <div className="testimonial-card">
            <div className="quote">"Vidomedi ha simplificado enormemente el cuidado de mi madre. Las alertas me mantienen informada siempre."</div>
            <div className="user">
              <div className="avatar">👩</div>
              <div className="user-info">
                <strong>María López</strong>
                <span>Hija y cuidadora</span>
              </div>
            </div>
          </div>
          <div className="testimonial-card">
            <div className="quote">"Como médico, recomiendo Vidomedi a mis pacientes mayores. Mejora la adherencia al tratamiento."</div>
            <div className="user">
              <div className="avatar">👨‍⚕️</div>
              <div className="user-info">
                <strong>Dr. Carlos Mendoza</strong>
                <span>Geriatra</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta-section">
        <h2>Empieza a cuidar mejor hoy mismo</h2>
        <p>Regístrate gratis y descubre cómo Vidomedi puede transformar la gestión de medicamentos.</p>
        <div className="cta-buttons">
          <Link to="/registro" className="btn btn-primary">Crear Cuenta Gratis</Link>
          <Link to="/login" className="btn btn-secondary">Acceder a Mi Cuenta</Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-logo">VIDOMEDI</div>
          <p>Cuidando la salud de nuestros mayores con tecnología y dedicación.</p>
          <div className="footer-links">
            <a href="#privacy">Privacidad</a>
            <a href="#terms">Términos</a>
            <a href="#contact">Contacto</a>
            <a href="#faq">Preguntas Frecuentes</a>
          </div>
          <div className="copyright">© 2023 Vidomedi. Todos los derechos reservados.</div>
        </div>
      </footer>
    </div>
  );
};

export default Home;