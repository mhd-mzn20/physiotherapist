import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../../styles/user/view.css';

const ViewPhysioProfile = () => {
    const { id } = useParams(); // Gets the ID from the URL
    const navigate = useNavigate();
    const [physio, setPhysio] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPhysioData = async () => {
            try {
                const res = await fetch(`http://localhost:5001/api/profile/${id}`);
                if (!res.ok) throw new Error("Physiotherapist not found");
                const data = await res.json();
                setPhysio(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchPhysioData();
    }, [id]);

    if (loading) return <div className="loader">Loading Specialist Profile...</div>;
    if (!physio) return <div className="error">Specialist not found.</div>;

    return (
        <div className='all-page'> 
            
        <div className="public-profile-container">
           
            <button className="back-btn" onClick={() => navigate(-1)}>← Back to Search</button>
            
            <div className="profile-main-card">
                <div className="profile-left">
                    <img 
                        src={physio.image || '/default-avatar.png'} 
                        alt={physio.fullname} 
                        className="large-avatar"
                    />
                    <div className="rating-badge">⭐ {physio.rating || 'N/A'}</div>
                </div>

                <div className="profile-right">
                    <span className="specialty-label">{physio.service}</span>
                    <h1>Dr. {physio.fullname}</h1>
                    <p className="exp-text"><strong>{physio.experience || 0}+ Years</strong> of Professional Experience</p>
                    
                    <div className="contact-summary">
                        <span>📧 {physio.email}</span>
                        <span>📞 {physio.telephone}</span>
                    </div>

                    
                </div>
            </div>

            <div className="profile-details-grid">
                <div className="detail-box">
                    <h3>Professional Biography</h3>
                    <p className="bio-text">
                        {physio.bio || "This specialist hasn't provided a biography yet, but they are highly qualified in their field of physiotherapy."}
                    </p>
                </div>

              
            </div>
        </div>
        </div>
    );
};

export default ViewPhysioProfile;