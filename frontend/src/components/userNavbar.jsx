import { Link, NavLink, useNavigate } from 'react-router-dom';
import { IoIosLogOut } from "react-icons/io";
import { useState, useEffect } from 'react';
import '../styles/user/userNavbar.css';

function UserNavbar() {
    const idUser = sessionStorage.getItem('idpatient');
    const [name, setName] = useState('User');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (idUser) {
            fetch(`http://localhost:5001/patients/${idUser}`)
                .then(res => res.json())
                .then(data => setName(data.name))
                .catch(err => console.error(err));
        }
    }, [idUser]);

    const handleLogout = () => {
        sessionStorage.clear();
        navigate('/login');
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    return (
        <header className="user-navbar">
            <div className="un-brand">
                <span className="un-logo-icon">⚕️</span>
                <span className="un-brand-name">PhysioCare</span>
            </div>

            {/* Mobile hamburger toggle */}
            <button className="un-mobile-toggle" onClick={toggleMenu} aria-label="Toggle menu">
                {isMenuOpen ? '✕' : '☰'}
            </button>

            <nav className={`un-nav ${isMenuOpen ? 'open' : ''}`}>
                <NavLink
                    to="/home"
                    className={({ isActive }) => isActive ? 'active' : ''}
                    onClick={closeMenu}
                >
                    Home
                </NavLink>
                <NavLink
                    to="/services"
                    className={({ isActive }) => isActive ? 'active' : ''}
                    onClick={closeMenu}
                >
                    Services
                </NavLink>
                <NavLink
                    to="/physio"
                    className={({ isActive }) => isActive ? 'active' : ''}
                    onClick={closeMenu}
                >
                    Find a Physio
                </NavLink>
                <NavLink
                    to="/about"
                    className={({ isActive }) => isActive ? 'active' : ''}
                    onClick={closeMenu}
                >
                    About
                </NavLink>

                {/* Mobile-only: appointments + welcome + logout */}
              
                <button className="un-logout-mobile" onClick={handleLogout}>
                    Logout
                </button>
            </nav>

            {/* Desktop actions */}
            <div className={`un-actions ${isMenuOpen ? 'open' : ''}`}>
                <Link to="/patient-reservations" className="un-appointments-btn">
                    My Appointments
                </Link>
                <p className="un-welcome">Welcome, <strong>{name}</strong></p>
                <Link to="/login" className="un-logout-btn" onClick={handleLogout} aria-label="Logout">
                    <IoIosLogOut />
                </Link>
            </div>
        </header>
    );
}

export default UserNavbar;