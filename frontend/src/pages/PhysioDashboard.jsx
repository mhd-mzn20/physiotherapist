import React, { useState, useEffect } from 'react';
import './../styles/dashboard.css';

const PhysioDashboard = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const physioId = sessionStorage.getItem('idUser');

    const fetchAppointments = async () => {
        if (!physioId) return;
        setLoading(true);
        try {
            const res = await fetch(`http://localhost:5001/api/physio-appointments/${physioId}`);
            const data = await res.json();
            setAppointments(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Fetch Error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAppointments();
    }, [physioId]);

    const handleStatusUpdate = async (idBooking, newStatus) => {
        try {
            const response = await fetch('http://localhost:5001/api/update-appointment-status', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ idBooking, status: newStatus })
            });

            const result = await response.json();
            if (result.success) {
                fetchAppointments(); 
            } else {
                alert("Failed to update status: " + result.error);
            }
        } catch (error) {
            console.error("Request failed:", error);
        }
    };

    if (loading) return <div className="loader">Loading...</div>;

    return (
        <div className="physio-dashboard-wrapper">
            <header className="dash-header">
                <h1>Physiotherapist Dashboard</h1>
            </header>
            
            <div className="appointment-grid">
                {appointments.length === 0 ? (
                    <p>No appointments scheduled.</p>
                ) : (
                    appointments.map((app) => (
                        <div key={app.idBooking} className={`appointment-card ${app.status}`}>
                            <div className="card-header">
                                <span className={`status-badge ${app.status}`}>{app.status}</span>
                                <strong>#BK-{app.idBooking}</strong>
                            </div>

                            <div className="card-body">
                                <p className="date-label">
                                    {new Date(app.available_date).toLocaleDateString()} at {app.appointment_time.substring(0, 5)}
                                </p>
                                <h3>{app.patientName}</h3>
                                
                                <div className="diagnostic-summary">
                                    <strong>Diagnosis:</strong> {app.diagnosis_name}
                                    <p className="diag-desc">{app.diagDesc}</p>
                                </div>

                                <div className="payment-tag">
                                    Status: <span className={app.payment_status}>{app.payment_status}</span> 
                                    ({app.payment_method})
                                </div>
                            </div>

                            <div className="card-footer">
                                {app.status === 'pending' ? (
                                    <div className="action-row">
                                        <button className="accept-btn" onClick={() => handleStatusUpdate(app.idBooking, 'accepted')}>
                                            Accept
                                        </button>
                                        <button className="reject-btn" onClick={() => handleStatusUpdate(app.idBooking, 'rejected')}>
                                            Reject
                                        </button>
                                    </div>
                                ) : (
                                    <p className="final-status">Session {app.status}</p>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default PhysioDashboard;