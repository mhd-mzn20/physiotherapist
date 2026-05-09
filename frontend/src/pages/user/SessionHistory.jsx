import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../../styles/user/sessions.css';


const SessionHistory = () => {
    const { idBooking } = useParams();
    const navigate = useNavigate();
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);

    const [showModal, setShowModal] = useState(false);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

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

   const handleRateSubmit = async () => {
    const docInfo = sessions[0];
    const idPatientFromStorage = sessionStorage.getItem('idpatient');
    const physioId = docInfo?.idUser; 

    if (!physioId || !idPatientFromStorage) {
        alert("Session data incomplete. Try logging out and back in.");
        return;
    }

    setIsSubmitting(true);
    try {
        const response = await fetch('http://localhost:5001/api/rate-physio', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                idUser: physioId, 
                idpatient: idPatientFromStorage, 
                rating: rating,
                comment: comment
            }),
        });

        // Parse the JSON response from the backend
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
                            <div className="button-row">
                                <button className="rate-session-btn" onClick={() => setShowModal(true)}>
                                    Rate Specialist
                                </button>
                            </div>
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
                                   
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </section>

                <section className="training-section">
                    <h2>2. Assigned Training & Exercises</h2>
                    <div className="exercise-grid">
                        <div className="exercise-card">
                            <img src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b" alt="Stretch" />
                            <div className="ex-info">
                                <h4>Cat-Camel Stretch</h4>
                                <p>Target Sets: 3 Sets</p>
                                <p>Target Reps: 12 Reps</p>
                                <p>Frequency: Medium</p>
                                <button className="start-btn">Start Exercise / Mark Done</button>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            {showModal && (
                <div className="modal-overlay">
                    <div className="rate-modal">
                        <h3>Rate Dr. {docInfo?.physioName}</h3>
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

export default SessionHistory;