import React, { useState, useEffect } from 'react';
import '../../styles/user/trainings.css'; // Make sure this path is correct for your project

const PatientTrainings = () => {
    const [trainings, setTrainings] = useState([]);
    const [loading, setLoading] = useState(true);
    const idpatient = sessionStorage.getItem('idpatient');

    useEffect(() => {
        const fetchTrainings = async () => {
            try {
                const res = await fetch(`http://localhost:5001/api/patient-trainings/${idpatient}`);
                const data = await res.json();
                setTrainings(data);
                setLoading(false);
            } catch (err) {
                console.error("Error:", err);
                setLoading(false);
            }
        };
        if (idpatient) fetchTrainings();
    }, [idpatient]);

    if (loading) {
        return (
            <div className="trainings-wrapper">
                <div className="trainings-container">
                    <div className="state-container">
                        <div className="spinner"></div>
                        <h2>Loading your program...</h2>
                        <p>We are fetching your prescribed exercises.</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="trainings-wrapper">
            <div className="trainings-container">
                <header className="trainings-header">
                    <h1>My Training Program</h1>
                    <p>Follow your prescribed exercises and routines to aid your recovery.</p>
                </header>

                <div className="trainings-grid">
                    {trainings.length > 0 ? (
                        trainings.map((item) => (
                            <div key={item.idtraining} className="training-card">
                                <div className="card-header-top">
                                    <span className="card-badge">{item.session_name}</span>
                                    <span className="session-date">
                                        {new Date(item.date_session).toLocaleDateString('en-GB', { 
                                            day: 'numeric', month: 'short', year: 'numeric' 
                                        })}
                                    </span>
                                </div>
                                
                                <h3>{item.training_title}</h3>
                                <p className="description">{item.description}</p>
                                
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
                            <h2>No Active Trainings</h2>
                            <p>You currently do not have any exercises assigned to your profile. Check back after your next session!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PatientTrainings;