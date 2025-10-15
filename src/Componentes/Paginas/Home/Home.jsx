// src/pages/Home.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Home.css";
import { Bell, Users, ClipboardList, PhoneCall } from "lucide-react";

const Home = () => {
  const [activePlan, setActivePlan] = useState("individual");

  return (
    <div className="wrappery">
      {/* NAVBAR */}
      <nav className="navbara">
        <div className="navbar-logo">
          <span  className="vidologo">VIDOMEDI</span>
          {/*<span>VIDOMEDI</span>*/}
        </div>
        <div className="navbar-links">
          <a href="#about">Nosotros</a>
          <a href="#benefits">Beneficios</a>
          <a href="#plans">Planes</a>
        </div>
        <div className="navbar-buttons">
          
          <Link to="/registro" className="btn-registro">
            Acceder
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section id="about" className="hero-section">
         <div className="hero-image">
                <img src="vidomedilogo.png" alt="Logo" className="logo" />
        </div>
        <div className="hero-content">
          <h1>Gestión inteligente de medicamentos</h1>
          <p>
            La solución perfecta para el cuidado de adultos mayores.
            Controla los medicamentos, alarmas y notificaciones para tutores
            de manera simple y confiable.
          </p>
          <div className="hero-buttons">
            <Link to="/registro" className="btn-registro">
            Crear Cuenta
          </Link>
            <Link to="/login" className="btn-secondary">
              Ya tengo cuenta
            </Link>
          </div>
        </div>
       
      </section>

      <section id="nosotros" className="nosotros">


      </section>
      {/* BENEFICIOS */}
      <section id="benefits" className="features-section">
        <h2>¿Por qué elegir Vidomedi?</h2>
        <div className="features-grid">
          <div className="feature-card">
             <Bell className="feature-icon" />
            <h3>Alarmas Inteligentes</h3>
            <p>Recordatorios automáticos para cada dosis de medicamento.</p>
          </div>
          <div className="feature-card">
            <Users className="feature-icon" />            <h3>Notificaciones a Tutores</h3>
            <p>Alertas instantáneas a familiares o cuidadores.</p>
          </div>
          <div className="feature-card">
            <ClipboardList className="feature-icon" />
            <h3>Historial Completo</h3>
            <p>Registro detallado de tomas con fecha, hora y dosis.</p>
          </div>
          <div className="feature-card">
            <PhoneCall className="feature-icon" />
            <h3>Contactos de Emergencia</h3>
            <p>Acceso rápido a contactos importantes en caso de necesidad.</p>
          </div>
        </div>
      </section>

      {/* PLANES */}
      <section id="plans" className="plans-section">
        <h2>Conoce nuestros planes</h2>

        <div className="plans-toggle">
          <button
            className={activePlan === "individual" ? "active" : ""}
            onClick={() => setActivePlan("individual")}
          >
            Individual
          </button>
          <button
            className={activePlan === "institucion" ? "active" : ""}
            onClick={() => setActivePlan("institucion")}
          >
            Colaboradores
          </button>
        </div>

        <div className="plans-grid">
          {activePlan === "individual" ? (
            <>
              <div className="plan-card">
                <h3>Básico</h3>
                <span className="price">Gratis</span>
                <ul>
                  <li>Registro ilimitado de recetas.</li>
                  <li>Registro de 1 contacto de confianza.</li>
                  <li>Seguimiento fácil de tus recetas médicas.</li>
                  <li>Notificaciones y alertas básicas para no olvidar tus dosis.</li>
                  <li>Con anuncios.</li>
                </ul>
                <button className="btn-elegir">Elegir</button>
              </div>

              <div className="plan-card">
                <h3>Premium</h3>
                <span className="price">$72.00/mes</span>
                <ul>
                  <li>Todo lo anterior</li>
                  <li>Hasta 2 contactos adicionales para compartir información.</li>
                  <li>Registro de recetas con fotos.</li>
                  <li>Notificaciones y alertas avanzadas.</li>
                  <li>Sin anuncios.</li>
                </ul>
                <button className="btn-elegir">Elegir</button>
              </div>
              <div className="plan-card">
                <div className="plan-header">
                  <h3>Plan Anual</h3>
                  <span className="price">$692.00/año</span>
                  <span className="descuento">$864.00/año</span>
                </div>
                  <ul>
                    <li>Todo lo del plan premium</li>
                    <li>20% de descuento por pago anual</li>                  
                  </ul>
                  <button className="btn-elegir">Elegir</button>
              </div>
            </>
          ) : (
            <>
              <div className="plan-card">
                <h3>Colaborador Estandar</h3>
                <span className="price">$1200.00/mes</span>
                <ul>
                  <li>Hasta 50 usuarios</li>
                  <li>Panel básico</li>
                  <li>Soporte estándar</li>
                  <li>25% de comisión</li>
                </ul>
                <button className="btn-elegir">Elegir</button>
              </div>

              <div className="plan-card">
                <h3>Colaborador Premium</h3>
                <span className="price">$3,800.00/mes</span>
                <ul>
                  <li>Hasta 150 usuarios</li>
                  <li>Personalización visual</li>
                  <li>Soporte prioritario</li>
                  <li>30% de comisión</li>
                </ul>
                <button className="btn-elegir">Elegir</button>
              </div>

              
            </>
          )}
        </div>
      </section>

      {/* CTA */}
      <section id="unete" className="cta-section">
        <h2>Empieza a cuidar mejor hoy mismo</h2>
        <p>Regístrate gratis y descubre cómo Vidomedi puede ayudarte.</p>
        <div className="cta-buttons">
          <Link to="/registro" className="btn-primary">
            Crear Cuenta Gratis
          </Link>
          <Link to="/login" className="btn-secondary">
            Acceder a mi cuenta
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-logo">VIDOMEDI</div>
          <p>Cuidando la salud de nuestros mayores con tecnología.</p>
          <div className="footer-links">
            UNIVERSIDAD TECNOLOGICA METROPOLITANA
          </div>
          <div className="copyright">
            © 2025 Vidomedi. Todos los derechos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
