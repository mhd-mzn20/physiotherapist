import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../styles/profile.css';

const PhysioProfile = () => {
    const { idUser: paramId } = useParams();
    const idUser = paramId || sessionStorage.getItem('idUser');
    const [isEditing, setIsEditing] = useState(false);
    const [isAddingExperience, setIsAddingExperience] = useState(false);
    const [editingExperienceId, setEditingExperienceId] = useState(null);
    const [allServices, setAllServices] = useState([]);
    const [experiences, setExperiences] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [newExperience, setNewExperience] = useState({
        title: '',
        company: '',
        start_date: '',
        end_date: '',
        description: ''
    });
    const [profile, setProfile] = useState({
        fullname: '',
        services: [],
        experience: 0,
        bio: '',
        telephone: '',
        image: '',
        rating: 0
    });
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    useEffect(() => {
        loadProfileData();
        loadExperiences();
        loadEvaluations();
    }, [idUser]);
// In PhysioProfile.jsx, update the loadProfileData function:
const loadProfileData = async () => {
    try {
        const [profileRes, servicesRes, physioServicesRes] = await Promise.all([
            fetch(`http://localhost:5001/api/profile/${idUser}`),
            fetch('http://localhost:5001/api/services'),
            fetch(`http://localhost:5001/api/physio-services/${idUser}`)
        ]);

        const profileData = await profileRes.json();
        const servicesData = await servicesRes.json();
        const physioServicesData = await physioServicesRes.json();

        if (profileData && !profileData.error) {
            setProfile({
                fullname: profileData.fullname || '',
                bio: profileData.bio || '',
                experience: profileData.experience || 0,
                telephone: profileData.telephone || '',
                image: profileData.image || '',
                rating: profileData.rating || 0,
                services: Array.isArray(physioServicesData) ? physioServicesData : []
            });
        }
        setAllServices(Array.isArray(servicesData) ? servicesData : []);
    } catch (err) {
        console.error("Error loading data:", err);
    }
};
const loadExperiences = async () => {
    try {
        const data = await fetch(`http://localhost:5001/api/experiences/${idUser}`).then(res => res.json());
        setExperiences(data || []);
    } catch (err) {
        console.error("Error loading experiences:", err);
    }
};

const loadEvaluations = async () => {
    try {
        const data = await fetch(`http://localhost:5001/api/evaluations/${idUser}`).then(res => res.json());
        setReviews(Array.isArray(data) ? data : []);
    } catch (err) {
        console.error("Error loading evaluations:", err);
    }
};

const handleAddExperience = async () => {
    if (!newExperience.title || !newExperience.company || !newExperience.start_date) {
        alert("Please fill in Title, Company, and Start Date");
        return;
    }

    try {
        const res = await fetch('http://localhost:5001/api/add-experience', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ idUser, ...newExperience })
        });

        if (!res.ok) throw new Error("Failed to add experience");
        
        await loadExperiences();
        setNewExperience({ title: '', company: '', start_date: '', end_date: '', description: '' });
        setIsAddingExperience(false);
        alert("Experience added successfully!");
    } catch (err) {
        console.error(err);
        alert("Failed to add experience");
    }
};

const handleUpdateExperience = async (id) => {
    const expToUpdate = experiences.find(e => e.id === id);
    
    if (!expToUpdate.title || !expToUpdate.company || !expToUpdate.start_date) {
        alert("Please fill in Title, Company, and Start Date");
        return;
    }

    try {
        const res = await fetch(`http://localhost:5001/api/update-experience/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(expToUpdate)
        });

        if (!res.ok) throw new Error("Failed to update experience");
        
        await loadExperiences();
        setEditingExperienceId(null);
        alert("Experience updated successfully!");
    } catch (err) {
        console.error(err);
        alert("Failed to update experience");
    }
};

const handleDeleteExperience = async (id) => {
    if (!window.confirm("Are you sure you want to delete this experience?")) return;

    try {
        const res = await fetch(`http://localhost:5001/api/delete-experience/${id}`, { method: 'DELETE' });
        
        if (!res.ok) throw new Error("Failed to delete experience");
        
        await loadExperiences();
        alert("Experience deleted successfully!");
    } catch (err) {
        console.error(err);
        alert("Failed to delete experience");
    }
};

const updateExperienceField = (id, field, value) => {
    setExperiences(experiences.map(e => e.id === id ? { ...e, [field]: value } : e));
};

const updateNewExperienceField = (field, value) => {
    setNewExperience(prev => ({ ...prev, [field]: value }));
};
    
    const getImageUrl = () => {
        if (previewUrl) return previewUrl;
        if (profile.image) return `http://localhost:5001/uploads/${profile.image}`;
        return '/default-avatar.png';
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProfile(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleCheckboxChange = (service) => {
        setProfile(prev => {
            const isSelected = prev.services.find(s => s.idService === service.idService);
            if (isSelected) {
                return { ...prev, services: prev.services.filter(s => s.idService !== service.idService) };
            }
            return { ...prev, services: [...prev.services, { idService: service.idService, title: service.title, price: 0 }] };
        });
    };

    const handlePriceChange = (idService, value) => {
        setProfile(prev => ({
            ...prev,
            services: prev.services.map(s => s.idService === idService ? { ...s, price: value } : s)
        }));
    };

  const handleSave = async () => {
    try {
        const formData = new FormData();
        formData.append('idUser', idUser);
        formData.append('fullname', profile.fullname);
        formData.append('experience', profile.experience);
        formData.append('bio', profile.bio);
        formData.append('telephone', profile.telephone);
        if (selectedFile) formData.append('profileImage', selectedFile);

        // 1. Save Profile Details First
        const profileRes = await fetch('http://localhost:5001/api/update-profile-details', { 
            method: 'POST', 
            body: formData 
        });
        if (!profileRes.ok) throw new Error("Failed to save profile");

        // 2. Save Services Second
        const serviceRes = await fetch('http://localhost:5001/api/update-physio-services', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ idUser, services: profile.services })
        });
        if (!serviceRes.ok) throw new Error("Failed to save services");

        // 3. Only reload AFTER both are guaranteed to be finished
        await loadProfileData();
        
        setIsEditing(false);
        setPreviewUrl(null);
        alert("Profile saved successfully!");
    } catch (err) {
        console.error(err);
        alert("Save failed. Please try again.");
    }
};

    if (!profile.fullname) return <div className="loader">Loading...</div>;

    return (
        <div className="profile-wrapper">
            <div className="profile-header-card">

                {/* ── LEFT SIDEBAR ── */}
                <div className="profile-sidebar">
                    <div className="image-section">
                        <img src={getImageUrl()} alt="Profile" className="profile-img-large" />
                        {isEditing && (
                            <label className="upload-overlay">
                                <input type="file" onChange={handleFileChange} accept="image/*" hidden />
                                <div className="change-photo-btn">✎</div>
                            </label>
                        )}
                    </div>

                    <h1>
                        {isEditing ? (
                            <input name="fullname" value={profile.fullname} onChange={handleInputChange} placeholder="Full Name" />
                        ) : (
                            profile.fullname
                        )}
                    </h1>

                    <div className="sidebar-details">
                        <div className="sidebar-detail-item">
                            <strong>Experience</strong>
                            {isEditing ? (
                                <input
                                    type="number"
                                    name="experience"
                                    value={profile.experience}
                                    onChange={handleInputChange}
                                    min="0"
                                    placeholder="Years"
                                />
                            ) : (
                                <span>{profile.experience} years</span>
                            )}
                        </div>

                        <div className="sidebar-detail-item">
                            <strong>Telephone</strong>
                            {isEditing ? (
                                <input
                                    type="tel"
                                    name="telephone"
                                    value={profile.telephone}
                                    onChange={handleInputChange}
                                    placeholder="Phone number"
                                />
                            ) : (
                                <span>{profile.telephone || '—'}</span>
                            )}
                        </div>
                    </div>

                    <button
                        className="main-action-btn"
                        onClick={isEditing ? handleSave : () => setIsEditing(true)}
                    >
                        {isEditing ? '💾 Save Profile' : '✏️ Edit Profile'}
                    </button>
                </div>

                {/* ── RIGHT MAIN CONTENT ── */}
                <div className="profile-main">

                    {/* Bio */}
                    <div className="bio-section">
                        <strong>About</strong>
                        {isEditing ? (
                            <textarea
                                name="bio"
                                value={profile.bio}
                                onChange={handleInputChange}
                                placeholder="Write a short bio about yourself"
                                rows="3"
                            />
                        ) : (
                            <span>{profile.bio || 'No bio available yet.'}</span>
                        )}
                    </div>

                    {/* Services */}
                    <div className="services-selector">
                        <h3>Services</h3>
                        {isEditing ? (
                            <div className="services-grid">
                                {allServices.map(service => {
                                    const selected = profile.services.find(s => s.idService === service.idService);
                                    return (
                                        <div key={service.idService} className="service-row">
                                            <input type="checkbox" checked={!!selected} onChange={() => handleCheckboxChange(service)} />
                                            <span>{service.title}</span>
                                            {selected && (
                                                <input type="number" placeholder="Price" value={selected.price} onChange={(e) => handlePriceChange(service.idService, e.target.value)} />
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <p>{profile.services.length > 0 ? profile.services.map(s => `${s.title} ($${s.price})`).join(' · ') : 'No services listed.'}</p>
                        )}
                    </div>

                    {/* Experience + Reviews side by side */}
                    <div className="bottom-grid">

                        {/* Work Experience */}
                        <div className="experience-section">
                            <div className="experience-header">
                                <h3>Work Experience</h3>
                                {isEditing && (
                                    <button className="add-exp-btn" onClick={() => setIsAddingExperience(!isAddingExperience)}>
                                        {isAddingExperience ? 'Cancel' : '+ Add'}
                                    </button>
                                )}
                            </div>

                            {isAddingExperience && (
                                <div className="experience-form">
                                    <input type="text" placeholder="Job Title" value={newExperience.title} onChange={(e) => updateNewExperienceField('title', e.target.value)} />
                                    <input type="text" placeholder="Company" value={newExperience.company} onChange={(e) => updateNewExperienceField('company', e.target.value)} />
                                    <input type="date" value={newExperience.start_date} max={new Date().toISOString().split('T')[0]} onChange={(e) => updateNewExperienceField('start_date', e.target.value)} />
                                    <input type="date" value={newExperience.end_date} onChange={(e) => updateNewExperienceField('end_date', e.target.value)} />
                                    <textarea placeholder="Description (optional)" value={newExperience.description} onChange={(e) => updateNewExperienceField('description', e.target.value)} rows="2" />
                                    <button className="save-exp-btn" onClick={handleAddExperience}>Save</button>
                                </div>
                            )}

                            {experiences.length > 0 ? (
                                <div className="experiences-list">
                                    {experiences.map(exp => (
                                        <div key={exp.id} className="experience-card">
                                            {editingExperienceId === exp.id ? (
                                                <div className="experience-form">
                                                    <input type="text" value={exp.title} onChange={(e) => updateExperienceField(exp.id, 'title', e.target.value)} />
                                                    <input type="text" value={exp.company} onChange={(e) => updateExperienceField(exp.id, 'company', e.target.value)} />
                                                    <input type="date" value={exp.start_date} max={new Date().toISOString().split('T')[0]} onChange={(e) => updateExperienceField(exp.id, 'start_date', e.target.value)} />
                                                    <input type="date" value={exp.end_date || ''} onChange={(e) => updateExperienceField(exp.id, 'end_date', e.target.value)} />
                                                    <textarea value={exp.description} onChange={(e) => updateExperienceField(exp.id, 'description', e.target.value)} rows="2" />
                                                    <button className="save-exp-btn" onClick={() => handleUpdateExperience(exp.id)}>Save</button>
                                                </div>
                                            ) : (
                                                <>
                                                    <div className="exp-title-row">
                                                        <div>
                                                            <h4>{exp.title}</h4>
                                                            <p className="exp-company">{exp.company}</p>
                                                        </div>
                                                        {isEditing && (
                                                            <div className="exp-actions">
                                                                <button className="edit-btn" onClick={() => setEditingExperienceId(exp.id)}>Edit</button>
                                                                <button className="delete-btn" onClick={() => handleDeleteExperience(exp.id)}>Del</button>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <p className="exp-date">
                                                        {new Date(exp.start_date).toLocaleDateString()}
                                                        {exp.end_date ? ` – ${new Date(exp.end_date).toLocaleDateString()}` : ' – Present'}
                                                    </p>
                                                    {exp.description && <p className="exp-description">{exp.description}</p>}
                                                </>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="no-exp-text">No work experience added yet</p>
                            )}
                        </div>

                        {/* Patient Reviews */}
                        <div className="reviews-section">
                            <div className="reviews-header">
                                <h3>⭐ Patient Reviews</h3>
                                <div className="overall-rating">
                                    <span className="overall-rating-score">{Number(profile.rating).toFixed(1)}</span>
                                    <span className="overall-rating-label">/ 5</span>
                                </div>
                            </div>
                            <p className="reviews-subtitle">Most recent 5 reviews</p>
                            {reviews.length === 0 ? (
                                <p className="no-reviews-text">No reviews yet.</p>
                            ) : (
                                <div className="reviews-list">
                                    {reviews.map((review, idx) => (
                                        <div key={idx} className="review-card">
                                            <div className="review-stars">
                                                {Array.from({ length: 5 }).map((_, i) => (
                                                    <span key={i} className={i < review.rating ? 'star filled' : 'star'}>★</span>
                                                ))}
                                                <span className="review-rating-num">{review.rating}/5</span>
                                            </div>
                                            {review.comment && <p className="review-comment">&ldquo;{review.comment}&rdquo;</p>}
                                            <p className="review-date">
                                                {new Date(review.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                    </div>{/* end bottom-grid */}
                </div>{/* end profile-main */}

            </div>
        </div>
    );
};

export default PhysioProfile;