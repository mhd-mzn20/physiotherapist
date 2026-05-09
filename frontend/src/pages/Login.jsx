import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';
import '../styles/components.css';
import '../styles/login.css';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

const handleLogin = async () => {
  try {
    const response = await fetch('http://localhost:5001/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: username.trim(), password: password.trim() }),
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.message || 'Login failed');
      return;
    }

    if (data.role) {
      sessionStorage.setItem('idUser', data.idUser); 
      const normalizedRole = data.role.toLowerCase().replace(' ', '_').trim();
      sessionStorage.setItem('role', normalizedRole);

      switch (normalizedRole) {
        case 'admin': navigate('/portal'); break;
        case 'physiotherapist': navigate(`/patients/${data.idUser}`); break;
        case 'biomedical_engineer': navigate(`/patients-biomedical/${data.idUser}`); break;
      }
    } else {
      sessionStorage.setItem('idpatient', data.idUser); 
      sessionStorage.setItem('role', 'patient'); 
      
      navigate(`/home/`); 
    }

  } catch (error) {
    alert('Server error. Try again later.');
  }
};

 

  return (
    <>
      <Header showPortalLink={false} />
      <div className="login-page">
        <div className="container">
          <h2>Login</h2>

          <label>Username (or Patient Name)</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
          />

          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
          />

          <div className="buttons">
            <button className="btn-primary" onClick={handleLogin}>Login</button>
            
          </div>

          <div style={{ marginTop: '20px', textAlign: 'center' }}>
            <p>New patient? <Link to="/register">Create an account</Link></p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Login;