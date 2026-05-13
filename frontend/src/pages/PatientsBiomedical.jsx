import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';


import '../styles/components.css';
import '../styles/patients-biomedical.css';

// Calculate age from birthdate
function calculateAge(birthdate) {
  if (!birthdate) return '';
  const birth = new Date(birthdate);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

function PatientsBiomedical() {
  const { idUser } = useParams(); // optional URL param
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [bioName, setBioName] = useState('Biomedical Engineer');
  const [bioId, setBioId] = useState(null);

  useEffect(() => {
    const loginId = sessionStorage.getItem('idUser'); // logged-in user
    const role = sessionStorage.getItem('role');

    let biomedicalId;

    // Admin can view any biomedical engineer's patients
    if (role === 'admin' && idUser) {
      biomedicalId = idUser;
    }
    // Biomedical engineer sees their own patients
    else if (role === 'biomedical_engineer') {
      biomedicalId = loginId;
    }
    // Not authorized
    else {
      navigate('/login');
      return;
    }

    setBioId(biomedicalId);

    const fetchPatients = async () => {
      try {
        const response = await fetch(
          `http://localhost:5001/api/biomedical-patients/${biomedicalId}`
        );
        const data = await response.json();
        const patientsWithAge = data.map((p) => ({
          ...p,
          age: calculateAge(p.birthdate),
        }));
        setPatients(patientsWithAge);
      } catch (err) {
        console.error('Error fetching patients:', err);
      }
    };

    const fetchBioName = async () => {
      try {
        const response = await fetch(`http://localhost:5001/api/users/${biomedicalId}`);
        const data = await response.json();
        setBioName(data.fullname || 'Biomedical Engineer');
      } catch (err) {
        console.error('Error fetching biomedical engineer info:', err);
      }
    };

    fetchPatients();
    fetchBioName();
  }, [idUser, navigate]);

  // Redirect to sessions page with patient and physiotherapist IDs
 const goToSessions = (patient) => {
  navigate(
    `/sessions-biomedical/${bioId}/${patient.idphysiotherapist}/${patient.idpatient}`
  );
};

  // Redirect to biomedicalinfo page with patient and physiotherapist IDs
 const goToBiomedicalInfo = (patient) => {
  navigate(
    `/biomedical/${bioId}/${patient.idphysiotherapist}/${patient.idpatient}`
  );
};

  const handleLogout = () => {
    sessionStorage.clear();
    navigate('/login');
  };


  return (
    <>
      
      <div className="container page-patients-biomedical">
        <div className="header-container">
          <h1>
            <u className='center'>Biomedical Engineer :</u> <br />
            {bioName}
          </h1>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
        <h2>Patients List</h2>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Age</th>
              <th>Sex</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {patients.length === 0 ? (
              <tr>
                <td colSpan="4">No patients found.</td>
              </tr>
            ) : (
              patients.map((patient) => (
                <tr key={patient.idpatient}>
                  <td>
                    <strong>{patient.name}</strong>
                  </td>
                  <td>{patient.age}</td>
                  <td>{patient.sexe === 1 || patient.sexe === '1' ? 'Male' : 'Female'}</td>
                  <td>
                    <div className="action-buttons-group">
                      <button
                        className="btn-primary"
                        onClick={() => goToSessions(patient)} 
                      >
                        Sessions
                      </button>
                      <button
                        className="btn-secondary"
                        onClick={() => goToBiomedicalInfo(patient)}
                      >
                        Add/View Biomedical Info
                      </button>
                    </div>

                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
    </>
  );
}

export default PatientsBiomedical;
