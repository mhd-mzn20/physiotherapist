import React, { useState } from 'react';
import { NavLink, useNavigate,useParams} from 'react-router-dom';
import '../styles/physioHeader.css';

const PhysioHeader = () => {
    const navigate = useNavigate();
    const {idUser} = useParams();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const isAdmin = sessionStorage.getItem('role') == 'admin';
    const handleLogout = () => {
        sessionStorage.clear();
        navigate('/login');
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <header className="physio-header">
            <div className="ph-brand">
                <span className="ph-logo">PT</span>
                <div className="ph-titles">
                    <h1>Physiotherapy</h1>
                    <p>Physiotherapist Portal</p>
                </div>
            </div>
            <button className={isAdmin ? 'shown' : 'hidden'} onClick={() => navigate(-1) }>
                Go Back
            </button>

            {/* Mobile menu toggle */}
            <button className="ph-mobile-toggle" onClick={toggleMenu}>
                ☰
            </button>

            <nav className={`ph-nav ${isMenuOpen ? 'open' : ''}`}>
                <NavLink 
                    to={`/patients/${idUser}`} 
                    className={({ isActive }) => (isActive ? 'ph-nav-link active' : 'ph-nav-link')}
                    onClick={() => setIsMenuOpen(false)}
                >
                     Patients
                </NavLink>
                <NavLink 
                    to={`/availability/${idUser}`} 
                    className={({ isActive }) => (isActive ? 'ph-nav-link active' : 'ph-nav-link')}
                    onClick={() => setIsMenuOpen(false)}
                >
                     Availability   
                </NavLink>
                
                <NavLink 
                    to={`/physio-dashboard/${idUser}`} 
                    className={({ isActive }) => (isActive ? 'ph-nav-link active' : 'ph-nav-link')}
                    onClick={() => setIsMenuOpen(false)}
                >
                     Dashboard
                </NavLink>

                <NavLink 
                    to={`/physioprofile/${idUser}`} 
                    className={({ isActive }) => (isActive ? 'ph-nav-link active' : 'ph-nav-link')}
                    onClick={() => setIsMenuOpen(false)}
                >
                     Profile
                </NavLink>

                {/* Mobile Logout Button (Visible only on mobile) */}
                <button className="ph-logout-btn-mobile" onClick={handleLogout}>
                    Logout
                </button>
            </nav>

            <div className="ph-actions">
                <button className="ph-logout-btn" onClick={handleLogout}>
                    Logout
                </button>
            </div>
        </header>
    );
};

export default PhysioHeader;
