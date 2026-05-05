import { Link, useLocation } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
function Header({ showPortalLink = true }) {
  const location = useLocation()
  const isPortal = location.pathname === '/portal'
  const role = localStorage.getItem('loginRole')
  const navigate = useNavigate()
  const isAdmin = role === 'admin'
  const linkTarget = isPortal ? '/login' : isAdmin ? '/portal' : '/login'
  const linkLabel = isPortal ? 'Back to Login' : isAdmin ? 'Back to Portal' : 'Back to Login'
     const handleLogout = () => {
        sessionStorage.clear();
        navigate('/login');
    };
  return (
    <header className="app-header">
      <div className="app-header__brand">
        <span className="app-header__logo">PT</span>
        <div>
          <h1>Physiotherapy</h1>
          <p>Clinical & Biomedical Portal</p>
        </div>
      </div>
      <div className="app-header__meta">
        <span>Compassionate care, smarter workflows</span>
      </div>
      {showPortalLink ? (
        <div className="app-header__actions">
          <button className="app-header__link" onClick={handleLogout}>
            {linkLabel}
          </button>
        </div>
      ) : null}
    </header>
  )
}

export default Header
