import React, { useState, useEffect } from 'react';
import '../../styles/user/reservations.css';

import { useNavigate } from 'react-router-dom';
const PatientReservations = () => {
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const idpatient = sessionStorage.getItem('idpatient');

    const navigate = useNavigate();

    const [showModal, setShowModal] = useState(false);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedPhysioId, setSelectedPhysioId] = useState(null);
    const [selectedPhysioName, setSelectedPhysioName] = useState('');

    const handleRateSubmit = async () => {
        if (!selectedPhysioId || !idpatient) {
            alert("Session data incomplete. Try logging out and back in.");
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await fetch('http://localhost:5001/api/rate-physio', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    idUser: selectedPhysioId, 
                    idpatient: idpatient, 
                    rating: rating,
                    comment: comment
                }),
            });

            const result = await response.json();

            if (response.ok) {
                alert("Thank you for your rating!");
                setShowModal(false);
                setComment('');
                window.location.reload(); 
            } else {
                alert(result.message || result.error || "An error occurred.");
            }
        } catch (error) {
            console.error("Error submitting rating:", error);
            alert("Network error. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

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
                                {res.status === 'rejected' ?'Cancelled': res.status}
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
                                    <span className={`status-badge-inline ${res.status}`}> {res.status === 'rejected' ?'Cancelled': res.status}</span>
                                    
                                </div>

                                {res.status === 'accepted' &&
                                    <button
                                        className="history-btn"
                                        onClick={() => navigate(`/session-history/${res.idBooking}`)}
                                    >
                                        View Session History
                                    </button>
                                }
                                {res.status === 'completed' &&
                                    <button
                                        className="rate-session-btn"
                                        onClick={async () => {
                                            setSelectedPhysioId(res.idUser);
                                            setSelectedPhysioName(res.physioName);
                                            try {
                                                const rateRes = await fetch(`http://localhost:5001/api/rate-physio/${res.idUser}/${idpatient}`);
                                                const rateData = await rateRes.json();
                                                if (rateData.success) {
                                                    setRating(rateData.rating);
                                                    setComment(rateData.comment || '');
                                                } else {
                                                    setRating(5);
                                                    setComment('');
                                                }
                                            } catch (err) {
                                                console.error("Failed to load past rating:", err);
                                                setRating(5);
                                                setComment('');
                                            }
                                            setShowModal(true);
                                        }}
                                    >
                                        Rate Specialist
                                    </button>
                                }
                            </div>
                        </div>
                    ))}
                </div>

                <p className="res-footer-note">Need to change a session? Contact support.</p>
            </div>

            {showModal && (
                <div className="modal-overlay">
                    <div className="rate-modal">
                        <h3>Rate Dr. {selectedPhysioName}</h3>
                        <p>How was your overall experience?</p>
                        <div className="star-picker">
                            {[1, 2, 3, 4, 5].map(num => (
                                <span 
                                    key={num} 
                                    className={num <= rating ? "star-large active" : "star-large"}
                                    onClick={() => setRating(num)}
                                >
                                    ★
                                </span>
                            ))}
                        </div>
                        <textarea 
                            placeholder="Share your feedback (optional)..." 
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                        />
                        <div className="modal-btns">
                            <button 
                                className="submit-rate-btn" 
                                onClick={handleRateSubmit}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "Submitting..." : "Submit Review"}
                            </button>
                            <button className="cancel-rate-btn" onClick={() => setShowModal(false)}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PatientReservations;