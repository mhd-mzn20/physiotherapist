import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../../styles/user/sessions.css';


const SessionHistory = () => {
    const { idBooking } = useParams();
    const navigate = useNavigate();
    const [sessions, setSessions] = useState([]);
    const [visits, setVisits] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`http://localhost:5001/api/session-history/${idBooking}?t=${Date.now()}`)
        .then(res => res.json())
        .then(data => {
            setSessions(Array.isArray(data) ? data : []);
            setLoading(false);
        })
            .catch(err => {
                console.error("Fetch error:", err);
                setSessions([]);
                setLoading(false);
            });
    }, [idBooking]);

    useEffect(() => {
        const idPatientFromStorage = sessionStorage.getItem('idpatient');
        if (sessions.length > 0) {
            const physioId = sessions[0]?.idUser;
            if (physioId && idPatientFromStorage) {
                fetch(`http://localhost:5001/api/visits/${physioId}/${idPatientFromStorage}`)
                    .then(res => res.json())
                    .then(data => {
                        setVisits(Array.isArray(data) ? data : []);
                    })
                    .catch(err => console.error("Error fetching visits:", err));
            }
        }
    }, [sessions]);

    if (loading) return <div className="loader">Loading your health records...</div>;

    if (sessions.length === 0) {
        return (
            <div className="no-data">
                <h2>No Session Records Found</h2>
                <p>We couldn't find any session history for this booking ID.</p>
                <button onClick={() => navigate(-1)}>Go Back</button>
            </div>
        );
    }
  
    const docInfo = sessions[0];
const getImageUrl = () => {
        return docInfo?.physioImage ? `http://localhost:5001/uploads/${docInfo.physioImage}` : '/default-avatar.png';
    };
    return (
        <div className="session-history-container">
            <button 
                className="back-btn"
                onClick={() => navigate(`/patient-reservations`)}
                style={{ width: '140px', float: 'left'}}    
            >
                ←Go Back
            </button>
            <div className="session-page-wrapper">
                
                <div className="doc-header-card">
                    <div className="doc-profile-main">
                        <img 
                            src={getImageUrl()} 
                            alt="Doctor" 
                            className="doc-img-circle" 
                        />
                        <div className="doc-text">
                            <h1>Dr. {docInfo?.physioName || 'Specialist'}</h1>
                            <p className="spec-text">{docInfo?.physioSpecialty || 'Physiotherapy'}</p>
                        </div>
                    </div>
                    <div className="rating-box">
                        <p>Current Rating</p>
                        <div className="stars-display">
                            {/* --- FIX 2: More reliable star rendering --- */}
                            {[1, 2, 3, 4, 5].map((star) => (
                                <span key={star} style={{ color: star <= Math.round(docInfo?.rating || 0) ? '#f1c40f' : '#e0e0e0' }}>
                                    ★
                                </span>
                            ))}
                            <span> ({docInfo?.rating ? Number(docInfo.rating).toFixed(1) : '0.0'})</span>
                        </div>
                    </div>
                </div>

                <section className="history-section">
                    <div className="section-header">
                        <h2>1. Session & Plan History</h2>
                        <span className="active-plan-tag">Active Plan</span>
                    </div>
                    <table className="history-table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Test / Assessment</th>
                                <th>Protocol / Exercise</th>
                                <th>Remark</th>
                                <th>Trainings</th>
                                
                            </tr>
                        </thead>
                        <tbody>
                            {sessions.map((s) => (
                                <tr key={s.idsession}>
                                    <td>{new Date(s.date).toLocaleDateString('en-GB', { 
                                        weekday: 'long', day: 'numeric', year: 'numeric' 
                                    })}</td>
                                    <td>{s.test_assessment}</td>
                                    <td>{s.protocol_exercise}</td>
                                    <td>{s.remark}</td>
                                    <td><button className="view-trainings-btn" onClick={() => navigate(`/my-trainings/${s.idsession}`)}>View Trainings</button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </section>

                <section className="history-section scheduled-visits-section">
                    <div className="section-header">
                        <h2>2. Scheduled Visits</h2>
                    </div>
                    {visits.length === 0 ? (
                        <p className="empty-visits-msg">No upcoming visits scheduled.</p>
                    ) : (
                        <div className="visits-list-container">
                            {visits.map(v => {
                                const visitDate = new Date(v.visit_date);
                                const isUpcoming = visitDate >= new Date(new Date().setHours(0,0,0,0));
                                return (
                                    <div key={v.id_visit} className={`visit-card-item ${isUpcoming ? 'upcoming' : 'past'}`}>
                                        <div className="visit-card-header">
                                            <h4 className="visit-card-date">
                                                {visitDate.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                                            </h4>
                                            <span className={`visit-status-badge ${isUpcoming ? 'upcoming' : 'past'}`}>
                                                {isUpcoming ? 'Upcoming' : 'Past'}
                                            </span>
                                        </div>
                                        {v.notes && (
                                            <div className="visit-notes-box">
                                                <strong>Note from Dr. {docInfo?.physioName}:</strong><br/>
                                                {v.notes}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </section>

             
            </div>
        </div>
    );
};

export default SessionHistory;