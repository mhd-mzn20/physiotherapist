import { Link } from 'react-router-dom';
import { IoIosLogOut } from "react-icons/io";
import { useState, useEffect } from 'react';

function UserNavbar() {
    const idUser = sessionStorage.getItem('idpatient');
    const [name, setName] = useState('User');
    
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
    };

    return (
        <header className="navbar">
            <div className="logo">
                <span className="logo-icon">⚕️</span>
                <div className="logo-text">
                    <strong>PhysioCare</strong>
                    
                </div>
            </div>
            <nav className="nav-links">
              
                <Link to={`/home`}>Home</Link>
                
                <Link to="/services">Services</Link>
                <Link to="/physio">Find a Physio</Link>
                <Link to="/about">About</Link>
            </nav>
            <Link to="/patient-reservations" className="btn-book-nav">My Appointments</Link>
            <p className="welcome-message">Welcome, {name}</p>
            
           
            <Link to="/login" className="logo-icon" onClick={handleLogout}>
                <IoIosLogOut />
            </Link>
        </header>
    );
}

export default UserNavbar;