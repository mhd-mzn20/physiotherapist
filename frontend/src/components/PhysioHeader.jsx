import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import '../styles/physioHeader.css';

const PhysioHeader = () => {
    const navigate = useNavigate();
    const idUser = sessionStorage.getItem('idUser');
    const [isMenuOpen, setIsMenuOpen] = useState(false);

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
                    to="/availability" 
                    className={({ isActive }) => (isActive ? 'ph-nav-link active' : 'ph-nav-link')}
                    onClick={() => setIsMenuOpen(false)}
                >
                     Availability   
                </NavLink>
                
                <NavLink 
                    to="/physio-dashboard" 
                    className={({ isActive }) => (isActive ? 'ph-nav-link active' : 'ph-nav-link')}
                    onClick={() => setIsMenuOpen(false)}
                >
                     Dashboard
                </NavLink>

                <NavLink 
                    to="/physioprofile" 
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
