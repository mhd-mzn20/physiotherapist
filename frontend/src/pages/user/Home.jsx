import React from 'react';
import '../../styles/user/home.css';
import homei from '../../assets/home.png'

import { Link } from 'react-router-dom';
const Home = () => {
  const services = [
    { title: 'Back Pain Relief', desc: 'Relief & physical maneuvers for lower back pain.', icon: '🧘' },
    { title: 'Sports Injury Rehab', desc: 'Injury rehab for all athletic levels.', icon: '🏃' },
    { title: 'Post-surgery Care', desc: 'Post-surgery care for faster recovery.', icon: '🛌' },
    { title: 'Orthopedic Therapy', desc: 'Specialized orthopedic therapy.', icon: '🦴' }
  ];
//hello

  return (
    <div className="physio-home">
      
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Book Your Recovery Journey Today</h1>
          <p>Accessible, personalized physiotherapy at your fingertips. Choose your specialist and schedule an appointment instantly.</p>
          <Link to="/physio" ><button className="btn-primary" >Find Your Physiotherapist</button></Link>
        </div>
        <div className="hero-image-container">
          <div className="circle-bg">
             {/* Replace with your actual illustration URL */}
            <img src={homei} alt="Physiotherapy Illustration" />
          </div>
        </div>
      </section>

      {/* Featured Services */}
      <section className="services">
        <h2>Featured Services</h2>
        <div className="services-grid">
          {services.map((s, i) => (
            <div key={i} className="service-card">
              <div className="service-icon">{s.icon}</div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How to Book */}
      <section className="how-to-book">
        <h2>How to Book</h2>
        <p className="subtitle">Interactive inclusion</p>
        <div className="steps-container">
          <div className="step-box">
            <span className="step-num">1</span>
            <h3>Select the service</h3>
            <p>Select the service you require.</p>
            <div className="pagination-dot active"></div>
          </div>

          <div className="step-arrow">›</div>

          <div className="step-box ">
            <span className="step-num">2</span>
            <h3>Choose your therapist</h3>
            <p>Choose your therapist and appointment date.</p>
            <div className="pagination-dot"></div>
          </div>

          <div className="step-arrow">›</div>

          <div className="step-box">
            <span className="step-num">3</span>
            <h3>Review and confirm</h3>
            <p>Review and confirm your booking.</p>
            <div className="pagination-dot"></div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;