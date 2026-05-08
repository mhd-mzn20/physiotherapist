import React, { useState, useEffect } from 'react';
import '../../styles/user/reservations.css';

import { useNavigate } from 'react-router-dom';
const PatientReservations = () => {
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const idpatient = sessionStorage.getItem('idpatient');

    const navigate = useNavigate();

    const formatServiceNames = (serviceNameValue) => {
        if (!serviceNameValue) return 'General Physiotherapy';
        const names = Array.isArray(serviceNameValue)
            ? serviceNameValue
            : String(serviceNameValue).split(',').map((name) => name.trim());
        return names.filter(Boolean).join(', ');
    };

    useEffect(() => {
        const fetchReservations = async () => {
            try {
                const res = await fetch(`http://localhost:5001/api/patient-reservations/${idpatient}`);
                const data = await res.json();
                setReservations(data);
            } catch (err) {
                console.error("Error:", err);
            } finally {
                setLoading(false);
            }
        };
        if (idpatient) fetchReservations();
    }, [idpatient]);

    if (loading) return <div className="loader">Loading your reservations...</div>;

    return (
        <div className="res-page-container">
            
            <div className="res-card-wrapper">
                <header className="res-main-header">
                    <h2>My Account: Your Reservations</h2>
                </header>

                <div className="res-grid">
                    {reservations.map((res) => (
                        <div key={res.idBooking} className={`res-card ${res.status}`}>
                            <div className={`res-card-header ${res.status}`}>
                                {res.status}
                            </div>

                            <div className="res-card-body">
                                <div className="physio-info">
                                    <img
                                        src={res.physioImage ? `http://localhost:5001/uploads/${res.physioImage}` : '/default-avatar.png'}
                                        alt={res.physioName ? `Dr. ${res.physioName}` : 'Physio'}
                                    />
                                    <div>
                                        <p className="spec-label">Specialist</p>
                                        <p className="physio-name">Dr. {res.physioName}</p>
                                        <p className="physio-sub">{formatServiceNames(res.serviceName)}</p>
                                    </div>
                                </div>

                                <div className="res-details">
                                    <p><strong>Date:</strong> {new Date(res.available_date).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}</p>
                                    <p><strong>Time:</strong> {res.start_time ? res.start_time.substring(0, 5) : 'N/A'}</p>
                                    <p><strong>Location:</strong> Main Clinic</p>
                                </div>

                                <div className="res-badge-row">
                                    <span className={`status-badge-inline ${res.status}`}>{res.status}</span>
                                    {res.status === 'pending' && <button className="cancel-btn">Cancel</button>}
                                </div>

                                {res.status === 'accepted' &&
                                    <button
                                        className="history-btn"
                                        onClick={() => navigate(`/session-history/${res.idBooking}`)}
                                    >
                                        View Session History
                                    </button>
                                }
                            </div>
                        </div>
                    ))}
                </div>

                <p className="res-footer-note">Need to change a session? Contact support.</p>
            </div>
        </div>
    );
};

export default PatientReservations;