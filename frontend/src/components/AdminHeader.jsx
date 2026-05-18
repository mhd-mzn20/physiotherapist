import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/adminHeader.css';

function AdminHeader() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    sessionStorage.clear();
    navigate('/login');
  };

  const navTo = (path) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="admin-header">

      {/* Brand */}
      <div className="admin-header__brand">
        <span className="admin-header__logo">AD</span>
        <div>
          <h1 className="admin-header__title">Admin Portal</h1>
          <p className="admin-header__sub">Physiotherapy Management System</p>
        </div>
      </div>

      {/* Mobile toggle */}
      <button className="admin-mobile-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
        ☰
      </button>

      {/* Nav */}
      <nav className={`admin-header__nav ${isMenuOpen ? 'open' : ''}`}>
        <button
          className={`admin-nav-btn ${isActive('/portal') ? 'active' : ''}`}
          onClick={() => navTo('/portal')}
        >
          Dashboard
        </button>

        <button
          className={`admin-nav-btn ${isActive('/admin-patients') ? 'active' : ''}`}
          onClick={() => navTo('/admin-patients')}
        >
           All Patients
        </button>

        <button
          className={`admin-nav-btn ${isActive('/admin-services') ? 'active' : ''}`}
          onClick={() => navTo('/admin-services')}
        >
          Services
        </button>

        <button
          className={`admin-nav-btn ${isActive('/add-user') ? 'active' : ''}`}
          onClick={() => navTo('/add-user')}
        >
           Add User
        </button>

        <button
          className={`admin-nav-btn ${isActive('/create-collaboration') ? 'active' : ''}`}
          onClick={() => navTo('/create-collaboration')}
        >
          Collaboration
        </button>

        <button
          className="admin-nav-btn admin-nav-btn--logout"
          onClick={handleLogout}
        >
          🚪 Logout
        </button>
      </nav>

    </header>
  );
}

export default AdminHeader;
