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

    // --- THE STATUS CHANGE FUNCTION ---
    const handleStatusUpdate = async (idBooking, newStatus) => {
        try {
            const response = await fetch('http://localhost:5001/api/update-appointment-status', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    idBooking: idBooking, 
                    status: newStatus 
                })
            });

            const result = await response.json();

            if (result.success) {
                // Refresh the list to show the updated status immediately
                fetchAppointments(); 
            } else {
                alert("Failed to update status: " + result.error);
            }
        } catch (error) {
            console.error("Request failed:", error);
            alert("Network error. Please try again.");
        }
    };

    if (loading) return <div className="loader">Loading...</div>;

    return (
        <div className="physio-dashboard">
          
            <h1>Physiotherapist Appointments</h1>
            <div className="appointment-grid">
                {appointments.length === 0 ? (
                    <p>No appointments found.</p>
                ) : (
                    appointments.map((app) => (
                        <div key={app.idBooking} className={`appointment-card ${app.status}`}>
                            <div className="card-header">
                                <span className={`status-pill ${app.status}`}>{app.status}</span>
                                <strong>#BK-{app.idBooking}</strong>
                            </div>

                            <div className="card-body">
                                <h3>Patient: {app.patientName}</h3>
                                <p><strong>Time:</strong> {app.appointment_time}</p>
                                <p><strong>Issue:</strong> {app.diagnostic}</p>
                            </div>

                            <div className="card-actions">
                                {app.status === 'pending' ? (
                                    <div className="button-group">
                                        <button 
                                            className="accept-btn" 
                                            onClick={() => handleStatusUpdate(app.idBooking, 'accepted')}
                                        >
                                            Accept
                                        </button>
                                        <button 
                                            className="reject-btn" 
                                            onClick={() => handleStatusUpdate(app.idBooking, 'rejected')}
                                        >
                                            Reject
                                        </button>
                                    </div>
                                ) : (
                                    <p className="final-status">This request has been <strong>{app.status}</strong></p>
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