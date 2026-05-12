import React, { useState, useEffect } from 'react';
import '../../styles/user/trainings.css'; // Verify this path is correct
import { useNavigate } from 'react-router-dom';
const PatientTrainings = () => {
    const [trainings, setTrainings] = useState([]);
    const [loading, setLoading] = useState(true);
    const idpatient = sessionStorage.getItem('idpatient'); // Make sure this is stored when patient logs in
    const navigate = useNavigate();
    useEffect(() => {
        const fetchTrainings = async () => {
            if (!idpatient) {
                setLoading(false);
                return;
            }
            try {
                const res = await fetch(`http://localhost:5001/api/patient-trainings/${idpatient}`);
                const data = await res.json();
                setTrainings(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error("Error loading trainings:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchTrainings();
    }, [idpatient]);

    if (loading) {
        return (
            <div className="trainings-wrapper">
                <div className="state-container">
                    <div className="spinner"></div>
                    <h2>Loading your program...</h2>
                </div>
            </div>
        );
    }

    if (!idpatient) {
        return (
            <div className="trainings-wrapper">
                <div className="state-container">
                    <h2>Authentication Error</h2>
                    <p>Please log in to view your training program.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="trainings-wrapper">
            <div className="back-btn " onClick={() => navigate(-1)} style={{float:'left'}} >
                &#8592; Back
            </div> 
            <div className="trainings-container">
                <header className="trainings-header">
                    <h1>My Prescribed Exercises</h1>
                    <p>Follow your customized recovery plan consistently for the best results.</p>
                </header>

                <div className="trainings-grid">
                    {trainings.length > 0 ? (
                        trainings.map((item) => (
                            <div key={item.train_id} className="training-card">
                                <div className="card-header-top">
                                    <span className="card-badge">Date: {new Date(item.assigned_date).toLocaleDateString()}</span>
                                    <span className="session-date">Session: {new Date(item.sessiondate).toLocaleDateString()}</span>
                                </div>
                                
                                <h3>{item.training_name}</h3>

                                {item.image && (
                                    <div className="exercise-image-box">
                                        <img
                                            src={`http://localhost:5001/uploads/${item.image}`}
                                            alt={item.training_name}
                                        />
                                    </div>
                                )}
                                
                                <div className="training-details">
                                    <div className="detail-row">
                                        <strong>Sets:</strong> <span>{item.sets}</span>
                                    </div>
                                    <div className="detail-row">
                                        <strong>Reps:</strong> <span>{item.reps}</span>
                                    </div>
                                    <div className="detail-row">
                                        <strong>Frequency:</strong> <span>{item.frequency || 'As advised'}</span>
                                    </div>
                                    {item.protocol && (
                                        <div className="detail-row protocol">
                                            <strong>Protocol:</strong> <span>{item.protocol}</span>
                                        </div>
                                    )}
                                </div>
                                
                                <div className="card-footer">
                                    <div className="doc-avatar">👨‍⚕️</div>
                                    <div className="doc-info">
                                        <span>Prescribed by</span>
                                        <span>Dr. {item.physiotherapist}</span>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="state-container">
                            <h2>No Active Exercises</h2>
                            <p>You currently do not have any exercises assigned to your profile. Check back after your next session!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PatientTrainings;