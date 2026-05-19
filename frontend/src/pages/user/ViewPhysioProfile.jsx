import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../../styles/user/view.css';

const ViewPhysioProfile = () => {
    const { id } = useParams(); // Gets the ID from the URL
    const navigate = useNavigate();
    const [physio, setPhysio] = useState(null);
    const [experiences, setExperiences] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPhysioData = async () => {
            try {
                const [profileRes, experienceRes] = await Promise.all([
                    fetch(`http://localhost:5001/api/profile/${id}`),
                    fetch(`http://localhost:5001/api/experiences/${id}`)
                ]);

                if (!profileRes.ok) throw new Error("Physiotherapist not found");
                if (!experienceRes.ok) throw new Error("Could not load experience records");

                const profileData = await profileRes.json();
                const experienceData = await experienceRes.json();

                setPhysio(profileData);
                setExperiences(experienceData || []);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchPhysioData();
    }, [id]);

    const getImageUrl = () => {
        return physio?.image ? `http://localhost:5001/uploads/${physio.image}` : '/default-avatar.png';
    };

    const formatServiceNames = (serviceString) => {
        if (!serviceString) return 'Not specified';
        return serviceString
            .split(',')
            .map(item => item.trim())
            .filter(Boolean)
            .join(', ');
    };

    const formatExperienceDates = (startDate, endDate) => {
        const start = startDate ? new Date(startDate).toLocaleDateString() : 'Unknown';
        const end = endDate ? new Date(endDate).toLocaleDateString() : 'Present';
        return `${start} — ${end}`;
    };

    if (loading) return <div className="loader">Loading Specialist Profile...</div>;
    if (!physio) return <div className="error">Specialist not found.</div>;

    return (
        <div className='all-page'> 
            <div className="public-profile-container">
                <button className="back-btn" onClick={() => navigate(-1)}>← Back to Search</button>

                <div className="profile-main-card">
                    <div className="profile-left">
                        <img 
                            src={getImageUrl()} 
                            alt={physio.fullname} 
                            className="large-avatar"
                        />
                        <div className="rating-badge">⭐ {physio.rating || 'N/A'}</div>
                    </div>

                    <div className="profile-right">
                        <h1>Dr. {physio.fullname}</h1>
                       

                        <div className="profile-meta">
                            <div className="meta-card">
                                <span>Experience</span>
                                <strong>{physio.experience ? `${physio.experience} Years` : 'Not listed'}</strong>
                            </div>
                            <div className="meta-card">
                                <span>Rating</span>
                                <strong>{physio.rating ? physio.rating : 'N/A'}</strong>
                            </div>
                            <div className="meta-card">
                                <span>Services</span>
                                <strong>{formatServiceNames(physio.service)}</strong>
                            </div>
                        </div>

                        <div className="contact-summary">
                            <span>📧 {physio.email || 'Email not available'}</span>
                            <span>📞 {physio.telephone || 'Phone not available'}</span>
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
                    <div className="detail-box">
                        <h3>Experience</h3>
                        {experiences.length ? (
                            <div className="experience-list">
                                {experiences.map(exp => (
                                    <div key={exp.id} className="experience-card">
                                        <div className="experience-header-row">
                                            <div>
                                                <h4>{exp.title}</h4>
                                                <p className="exp-company">{exp.company}</p>
                                            </div>
                                            <p className="exp-date">{formatExperienceDates(exp.start_date, exp.end_date)}</p>
                                        </div>
                                        <p className="exp-description">{exp.description || 'No description provided.'}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="no-exp-text">No experience records available for this specialist.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewPhysioProfile;