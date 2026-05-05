import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/user/register.css';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    birthdate: '',
    sexe: '',
    password: '',
    confirmPassword: ''
  });
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const response = await fetch('http://localhost:5001/api/register-patient', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          birthdate: formData.birthdate,
          sexe: formData.sexe, 
          password: formData.password
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Registration successful!');
        navigate('/login');
      } else {
        alert(data.message || 'Registration failed');
      }
    } catch (error) {
      alert('Connection error. Is the server running?');
    }
  };

  return (
    <div className="login-page">
    
      <div className="container page-register">
        <h2>Create Patient Account</h2>
        <form onSubmit={handleRegister}>
          <label>Full Name</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} required />

          <label>Birthdate</label>
          <input type="date" name="birthdate" value={formData.birthdate} onChange={handleChange} required />

          <label>Sexe</label>
          <select name="sexe" value={formData.sexe} onChange={handleChange} required>
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>

          <label>Password</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} required />

          <label>Confirm Password</label>
          <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required />

          <div className="buttons">
            <button type="submit" className="btn-primary signup">Sign Up</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;