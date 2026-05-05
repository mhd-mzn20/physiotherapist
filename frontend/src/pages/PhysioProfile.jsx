import React, { useState, useEffect } from 'react';
import '../styles/profile.css';

const PhysioProfile = () => {
    const idUser = sessionStorage.getItem('idUser');
    const [isEditing, setIsEditing] = useState(false);
    const [allServices, setAllServices] = useState([]);
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
    }, [idUser]);
const loadProfileData = async () => {
    try {
        const [profileData, servicesData, physioServicesData] = await Promise.all([
            fetch(`http://localhost:5001/api/profile/${idUser}`).then(res => res.json()),
            fetch('http://localhost:5001/api/services').then(res => res.json()),
            fetch(`http://localhost:5001/api/physio-services/${idUser}`).then(res => res.json())
        ]);

        // Only update if data exists
        if (profileData && Object.keys(profileData).length > 0) {
            setProfile({
                ...profileData,
                services: physioServicesData || []
            });
        }
        setAllServices(servicesData);
    } catch (err) {
        console.error("Error loading data:", err);
    }
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
                <div className="image-section">
                    <img src={getImageUrl()} alt="Profile" className="profile-img-large" />
                    {isEditing && (
                        <label className="upload-overlay">
                            <input type="file" onChange={handleFileChange} accept="image/*" hidden />
                            <div className="change-photo-btn">Change Photo</div>
                        </label>
                    )}
                </div>
                <div></div>
                <h1>
                    {isEditing ? (
                        <input name="fullname" value={profile.fullname} onChange={handleInputChange} />
                    ) : (
                        profile.fullname
                    )}
                </h1>

                <div className="services-selector">
                    {isEditing ? (
                        allServices.map(service => {
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
                        })
                    ) : (
                        <p>{profile.services.map(s => `${s.title} ($${s.price})`).join(', ')}</p>
                    )}
                </div>

                <button onClick={isEditing ? handleSave : () => setIsEditing(true)}>
                    {isEditing ? "Save Profile" : "Edit Profile"}
                </button>
            </div>
        </div>
    );
};

export default PhysioProfile;