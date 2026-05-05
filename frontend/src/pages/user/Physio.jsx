import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import '../../styles/user/physio.css';
import doctor from '../../assets/doctor-icon.png';

const Physio = () => {
  const [physios, setPhysios] = useState([]);
  const [activeAppointments, setActiveAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const idpatient = sessionStorage.getItem('idpatient');
  
  const filteredPhysios = physios.filter((doc) => {
    return search.trim() === ''
      ? doc
      : doc.servicesList?.toLowerCase().includes(search.toLowerCase());
  });
  useEffect(() => {
    if (!idpatient) return;

    // Fetch physiotherapists (with their aggregated services) and active appointments
    Promise.all([
      fetch('http://localhost:5001/physio').then(res => res.json()),
      fetch(`http://localhost:5001/api/patient-active-appointments/${idpatient}`).then(res => res.json())
    ])
    .then(([physioData, apptData]) => {
      setPhysios(physioData);
      setActiveAppointments(apptData);
      setLoading(false);
    })
    .catch(err => {
      console.error("Error loading data:", err);
      setLoading(false);
    });
  }, [idpatient]);

  const handleSelectSpecialist = (doc) => {
    const existing = activeAppointments.find(app => String(app.physioId) === String(doc.idUser));
    
    if (existing) {
      alert(`You already have an appointment with Dr. ${existing.physioName}.`);
    } else {
      navigate(`/booking/${doc.idUser}`);
    }
  };

  if (loading) return <div className="loader">Loading...</div>;

  return (
    <div className="find-physio-page">
      
      <main className="container">
        <h2 className="section-title">Our Expert Physiotherapists</h2>
        <input type="text" placeholder="filter by service..."  className='search'
        onChange={(e) => setSearch(e.target.value)}
        />
        <div className="physio-grid">
          {filteredPhysios.map((doc) => (
            <div key={doc.idUser} className="physio-card">
              <div className="card-header">
                <img src={doc.image || doctor} alt={doc.fullname} className="doc-img" />
                <div className="doc-details">
                  <h3>{doc.fullname}</h3>
                  <div className="stars">{'★'.repeat(doc.rating || 5)}</div>
                </div>
              </div>
              <div className="card-body">
                {/* Render services as bubble tags */}
                <div className="doc-services">
                  {doc.servicesList ? doc.servicesList.split(', ').map((service, i) => (
                    <span key={i} className="service-bubble">{service + ","} </span>
                  )) : <span className="no-service">General Physiotherapy</span>}
                </div>
                <br />
                <div className="button-group">
                  <button 
                    className="btn-select" 
                    onClick={() => handleSelectSpecialist(doc)}
                  >
                    Select Specialist
                  </button>
                  <button 
                    className="btn-profile"
                    onClick={() => navigate(`/view-physio/${doc.idUser}`)}
                  >
                    See Profile
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Physio;