import React, { useState, useEffect } from 'react';
import '../../styles/user/Services.css';
import { useNavigate } from 'react-router-dom';

const Services = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  // Static approach data (business values don't change often)
  const approaches = [
    { title: 'Personalized Plans', desc: 'Personalized plans for optimal recovery and ensuring greater long-term health.', icon: '📝' },
    { title: 'Expert Therapists', desc: 'Expert therapists with years of experience and specialized certifications.', icon: '👨‍⚕️' },
    { title: 'Evidence-Based Care', desc: 'Evidence-based care practices for effective and safe treatments.', icon: '🔬' },
    { title: 'Progress Tracking', desc: 'Regular monitoring and tracking of your recovery journey.', icon: '📊' }
  ];

  // Fetch dynamic services from the backend
  useEffect(() => {
    fetch('http://localhost:5001/api/services')
      .then((res) => res.json())
      .then((data) => {
        setServices(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching services:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="services-page">
      <main className="container">
        <h1 className="main-title">Our Physiotherapy Services</h1>
        
        {loading ? (
          <div className="loader">Loading services...</div>
        ) : (
          <div className="services-grid">
            {services.map((service) => (
              <div key={service.idService} className="service-card">
                <div className="icon-wrapper">{service.icon}</div>
                <h3>{service.title}</h3>
                <p className="description">{service.description}</p>
                <p className="sub-description">{service.subDesc}</p>
              </div>
            ))}
          </div>
        )}

        <div className="cta-container">
          <button className="btn-secondary" onClick={() => navigate('/physio')}>
            Find Your Specialist
          </button>
        </div>

        <section className="approach-section">
          <h2 className="section-title">Our Approach to Your Recovery</h2>
          <div className="approach-grid">
            {approaches.map((item, index) => (
              <div key={index} className="approach-item">
                <div className="approach-icon">{item.icon}</div>
                <div className="approach-text">
                  <h4>{item.title}</h4>
                  <p>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Services;