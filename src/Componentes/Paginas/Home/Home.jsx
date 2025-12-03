import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Home.css";
import { 
  Bell, 
  Users, 
  ClipboardList, 
  PhoneCall,
  //Calendar,
  Pill,
  Menu,
  X,
  //Shield,
  Clock,
  CheckCircle,
  //Star,
  //Zap
} from "lucide-react";

const Home = () => {
  const [activePlan, setActivePlan] = useState("individual");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const features = [
    {
      icon: Bell,
      title: "Recordatorios Inteligentes",
      description: "Alertas programables para cada dosis de medicamento"
    },
    {
      icon: Users,
      title: "Notificaciones a Cuidadores",
      description: "Mantén informados a familiares o tutores"
    },
    {
      icon: ClipboardList,
      title: "Historial Detallado",
      description: "Registro completo de tomas para seguimiento médico"
    },
    {
      icon: PhoneCall,
      title: "Contactos de Emergencia",
      description: "Acceso rápido a contactos importantes"
    }
  ];

  const individualPlans = [
    {
      name: "Básico",
      price: "Gratis",
      period: "",
      features: [
        "Registro ilimitado de recetas",
        "1 contacto de confianza",
        "Seguimiento de recetas médicas",
        "Notificaciones básicas",
        "Con anuncios"
      ],
      buttonText: "Comenzar Gratis"
    },
    {
      name: "Premium",
      price: "$80",
      period: "/mes",
      features: [
        "Todo lo del plan Básico",
        "Hasta 2 contactos adicionales",
        "Registro de recetas con fotos",
        "Notificaciones avanzadas",
        "Sin anuncios"
      ],
      buttonText: "Elegir Plan"
    },
    {
      name: "Plan Anual",
      price: "$692",
      period: "/año",
      discount: { original: "$864", save: "$172" },
      features: [
        "Todo lo del plan Premium",
        "20% de descuento anual",
        "Soporte prioritario incluido",
        "Actualizaciones gratuitas"
      ],
      buttonText: "Elegir Plan"
    }
  ];

  const businessPlans = [
    {
      name: "Colaborador Estándar",
      price: "$1,200",
      period: "/mes",
      features: [
        "Hasta 50 usuarios",
        "Panel de administración básico",
        "Soporte estándar",
        "25% de comisión"
      ],
      buttonText: "Elegir plan"
    },
    {
      name: "Colaborador Premium",
      price: "$3,800",
      period: "/mes",
      features: [
        "Hasta 150 usuarios",
        "Personalización visual",
        "Soporte prioritario",
        "30% de comisión",
        "Reportes avanzados"
      ],
      buttonText: "Elegir plan"
    }
  ];

  return (
    <div className="wrapper">
      {/* NAVBAR MEJORADO */}
      <nav className="navbar">
        <div className="navbar-logo">
          <img src="logoazul.png" alt="Vidomedi Logo" />
        </div>
        <div className={`navbar-links ${mobileMenuOpen ? 'active' : ''}`}>
          <a href="#inicio" onClick={() => setMobileMenuOpen(false)}>Inicio</a>
          <a href="#features" onClick={() => setMobileMenuOpen(false)}>Características</a>
          <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)}>Cómo Funciona</a>
          <a href="#plans" onClick={() => setMobileMenuOpen(false)}>Planes</a>
        </div>
        <div className="navbar-buttons">
          <Link to="/login" className="btn-secondary">
            Iniciar Sesión
          </Link>
          <Link to="/registro" className="btn-registro">
            Comenzar Gratis
          </Link>
        </div>
        <button 
          className="mobile-menu-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* HERO SECTION MEJORADA */}
      <section id="inicio" className="hero-section">
        <div className="container">
          <div className="hero-content">
            <div className="hero-badge">
              <Pill size={20} />
              Gestor de Medicamentos
            </div>
            <h1>
              Cuida Tu Salud Con 
              <span className="hero-highlight"> VIDOMEDI</span>
            </h1>
            <p className="hero-subtitle">
              La plataforma más innovadora para gestionar medicamentos, con recordatorios 
              inteligentes y conexión directa con tus seres queridos. Simple, seguro y efectivo.
            </p>
            <div className="hero-buttons">
              <Link to="/registro" className="btn-primary">
                
                Comenzar Gratis
              </Link>
         
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION MEJORADA */}
      <section id="features" className="features-section">
        <div className="container">
          <div className="section-header">
            <h2>Todo para tu bienestar en un solo lugar</h2>
          </div>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">
                  <feature.icon size={24} />
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="how-it-works">
        <div className="container">
          <div className="section-header">
            <h2>Así de Fácil es Cuidar Tu Salud</h2>
            <p>Tres pasos sencillos para transformar tu rutina médica</p>
          </div>
          <div className="steps-horizontal">
            <div className="step-horizontal">
              <div className="step-number">1</div>
              <div className="step-content">
                <div className="step-icon">
                  <ClipboardList size={24} />
                </div>
                <h3>Registra Tus Medicamentos</h3>
                <p>Agrega todos tus medicamentos con horarios y dosis específicas</p>
              </div>
            </div>
            <div className="step-horizontal">
              <div className="step-number">2</div>
              <div className="step-content">
                <div className="step-icon">
                  <Bell size={24} />
                </div>
                <h3>Configura Recordatorios</h3>
                <p>Programa alertas personalizadas para cada toma de medicamento</p>
              </div>
            </div>
            <div className="step-horizontal">
              <div className="step-number">3</div>
              <div className="step-content">
                <div className="step-icon">
                  <Users size={24} />
                </div>
                <h3>Comparte con Cuidadores</h3>
                <p>Agrega familiares o tutores para que reciban notificaciones</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="plans" className="plans-section">
        <div className="container">
          <div className="section-header">
            <h2>Elige el Plan que Se Adapte a Ti</h2>
            <p>Desde uso personal hasta soluciones institucionales completas</p>
          </div>

          <div className="plans-toggle">
            <button
              className={activePlan === "individual" ? "active" : ""}
              onClick={() => setActivePlan("individual")}
            >
              Para Individuos
            </button>
            <button
              className={activePlan === "business" ? "active" : ""}
              onClick={() => setActivePlan("business")}
            >
              Para Colaboradores
            </button>
          </div>

          <div className={`plans-container ${activePlan === "business" ? "business-plans" : ""}`}>
            <div className="plans-grid">
              {(activePlan === "individual" ? individualPlans : businessPlans).map((plan, index) => (
                <div key={index} className="plan-card">
                  {plan.discount && (
                    <div className="discount-badge">Ahorras {plan.discount.save}</div>
                  )}
                  
                  <div className="plan-header">
                    <h3>{plan.name}</h3>
                    <div className="price-section">
                      <div className="price">
                        {plan.price}
                        <span className="period">{plan.period}</span>
                      </div>
                      {plan.discount && (
                        <div className="original-price">{plan.discount.original}</div>
                      )}
                    </div>
                  </div>

                  <ul className="plan-features">
                    {plan.features.map((feature, idx) => (
                      <li key={idx}>
                        <CheckCircle size={16} />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <button className="btn-plan">
                    {plan.buttonText}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <div className="cta-badge">Comienza Hoy</div>
            <h2>Transforma Tu Rutina Médica Ahora</h2>
            <p>Únete a los usuarios que ya están cuidando mejor de su salud con Vidomedi</p>
            <div className="cta-buttons">
              <Link to="/registro" className="btn-primary">
                <Pill size={20} />
                Crear Cuenta Gratis
              </Link>
              <Link to="/login" className="btn-secondary">
                <Clock size={20} />
                Acceder a Mi Cuenta
              </Link>
            </div>
            <div className="cta-guarantee">
              <CheckCircle size={16} />
              <span>Sin compromisos · Cancelar cuando quieras · Soporte 24/7</span>
            </div>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <div className="footer-logo">
                <img src="logoblanco.png" alt="Vidomedi" />
              </div>
              <p>Revolucionando el cuidado de la salud con tecnología confiable, accesible y centrada en las personas.</p>
            </div>
            <div className="footer-links">
              <div className="footer-column">
                <h4>Producto</h4>
                <a href="#inicio">Inicio</a>
                <a href="#features">Características</a>
                <a href="#plans">Planes</a>
                <a href="#how-it-works">Cómo Funciona</a>
              </div>
              <div className="footer-column">
                <h4>Empresa</h4>
                <a href="#about">Nosotros</a>
                <a href="#contact">Contacto</a>
              </div>
              <div className="footer-column">
                <h4>Legal</h4>
                <a href="#privacy">Privacidad</a>
                <a href="#terms">Términos</a>
                <a href="#security">Seguridad</a>
                <a href="#cookies">Cookies</a>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <div className="copyright">
              © 2025 VIDOMEDI. Universidad Tecnológica Metropolitana. 
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;