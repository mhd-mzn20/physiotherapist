import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import '../styles/components.css';
import '../styles/sessions-biomedical.css';

function SessionsBiomedical() {
  const navigate = useNavigate();
  const { idBiomedical, idPhysiotherapist, idpatient } = useParams();


  const [biomedicalName, setBiomedicalName] = useState('');
  const [physioName, setPhysioName] = useState('');
  const [patientName, setPatientName] = useState('');
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  /* =========================
     AUTH CHECK
  ========================= */
  useEffect(() => {
    if (!idBiomedical) {
      navigate('/login');
    }
  }, [navigate, idBiomedical]);

  /* =========================
     FETCH BIOMEDICAL NAME
  ========================= */
  useEffect(() => {
    if (!idBiomedical) return;

    fetch(`http://localhost:5001/api/users/${idBiomedical}`)
      .then(res => res.json())
      .then(data => setBiomedicalName(data.fullname || 'Biomedical Engineer'))
      .catch(console.error);
  }, [idBiomedical]);

  /* =========================
     FETCH PATIENT AND PHYSIOTHERAPIST
  ========================= */
  useEffect(() => {
    if (!idpatient) return;

    const fetchPatientAndPhysio = async () => {
      try {
        const resPatient = await fetch(
          `http://localhost:5001/api/patients/details/${idpatient}`
        );
        const patientData = await resPatient.json();
        setPatientName(patientData.name);

        // Fetch physiotherapist info
        if (idPhysiotherapist) {
          const resPhysio = await fetch(
            `http://localhost:5001/api/users/${idPhysiotherapist}`
          );
          const physioData = await resPhysio.json();
          setPhysioName(physioData.fullname || 'physio');
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchPatientAndPhysio();
  }, [idpatient]);

  /* =========================
     FETCH SESSIONS
  ========================= */
  useEffect(() => {
    if (!idpatient) return;

    const fetchSessions = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `http://localhost:5001/api/sessions/${idpatient}`
        );
        const data = await res.json();

        // Ensure each session has videos array
        const sessionsWithVideos = data.map(s => ({
          ...s,
          videos: s.videos || [],
        }));

        setSessions(sessionsWithVideos);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, [idpatient]);


  return (
    <>
     
      <div className="container extra-wide page-sessions-biomedical">
        <button onClick={() => navigate(-1)} className="back-btn">← Back to Patients</button>
        <h2>Therapy Sessions</h2>

        <p><strong>Biomedical Engineer:</strong> {biomedicalName}</p>
        <p><strong>Physiotherapist:</strong> {physioName}</p>
        <p><strong>Patient:</strong> {patientName}</p>

        {loading ? (
          <p>Loading sessions...</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Session ID</th>
                <th>Date</th>
                <th>Test</th>
                <th>Protocol</th>
                <th>Remark</th>
                <th>Videos</th>
                
              </tr>
            </thead>

            <tbody>
              {sessions.length === 0 ? (
                <tr>
                  <td colSpan="7">No sessions found.</td>
                </tr>
              ) : (
                sessions.map(session => (
                  <tr key={session.idsession}>
                    <td>{session.idsession}</td>
                    <td>{new Date(session.sessiondate).toLocaleDateString()}</td>
                    <td>{session.test}</td>
                    <td>{session.protocol}</td>
                    <td>{session.remark}</td>
                    <td>
                      {session.videos.length > 0 ? (
                        session.videos.map((file, index) => (
                          <div key={index}>
                            <a
                              href={`http://localhost:5001/uploads/${file}`}
                              target="_blank"
                              rel="noreferrer"
                            >
                              {file}
                            </a>
                          </div>
                        ))
                      ) : (
                        <em>No videos</em>
                      )}
                    </td>
                  
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    
    </>
  );
}

export default SessionsBiomedical;
