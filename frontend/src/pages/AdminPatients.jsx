import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/components.css';
import '../styles/adminPatients.css';

function AdminPatients() {
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterText, setFilterText] = useState('');

  // Protect: admin only
  useEffect(() => {
    const role = sessionStorage.getItem('role');
    if (!role || role !== 'admin') {
      navigate('/login');
      return;
    }
    fetch('http://localhost:5001/api/admin/patients')
      .then(res => res.json())
      .then(data => {
        setPatients(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [navigate]);

  const calculateAge = (birthdate) => {
    const today = new Date();
    const birth = new Date(birthdate);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return age;
  };

  const filtered = useMemo(() => {
    const q = filterText.trim().toLowerCase();
    if (!q) return patients;
    return patients.filter(p => {
      const text = `${p.name} ${p.sexe === 1 ? 'male' : 'female'} ${p.physiotherapistName || ''}`;
      return text.toLowerCase().includes(q);
    });
  }, [filterText, patients]);

  if (loading) return <div className="loader">Loading patients...</div>;

  return (
    <div className="admin-patients-page">
      <div className="ap-header">
        <button className="ap-back-btn" onClick={() => navigate('/portal')}>
          ← Back to Portal
        </button>
        <div className="ap-title-group">
          <h1>All Patients</h1>
          <span className="ap-count">{filtered.length} patient{filtered.length !== 1 ? 's' : ''}</span>
        </div>
      </div>

      <div className="ap-search-bar">
        <input
          type="text"
          placeholder="Search by name, gender, physiotherapist…"
          value={filterText}
          onChange={e => setFilterText(e.target.value)}
          className="ap-search-input"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="ap-empty">No patients found.</div>
      ) : (
        <div className="ap-table-wrapper">
          <table className="ap-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Gender</th>
                <th>Age</th>
                
                <th>Physiotherapist</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p, i) => (
                <tr key={p.idpatient}>
                  <td className="ap-idx">{i + 1}</td>
                  <td className="ap-name">{p.name}</td>
                  <td>
                    <span className={`ap-gender ${p.sexe === 1 ? 'male' : 'female'}`}>
                      {p.sexe === 1 ? '♂ Male' : '♀ Female'}
                    </span>
                  </td>
                  <td>{calculateAge(p.birthdate)} yrs</td>
                 
                  <td className="ap-physio">{p.physiotherapistName || <span className="ap-unassigned">Unassigned</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminPatients;
