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
    const loggedId = sessionStorage.getItem('idUser');
    const role = sessionStorage.getItem('role');

    // Allow admin to view any biomedical engineer's patient sessions
    // or biomedical engineer to view their own patients
    if (
      !loggedId ||
      !(
        role === 'admin' ||
        (role === 'biomedical_engineer' && loggedId === idBiomedical)
      )
    ) {
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
        if (patientData.idphysiotherapist) {
          const resPhysio = await fetch(
            `http://localhost:5001/api/users/${patientData.idphysiotherapist}`
          );
          const physioData = await resPhysio.json();
          setPhysioName(physioData.fullname || '');
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

  /* =========================
     DELETE SESSION
  ========================= */
  const deleteSession = async (idsession) => {
    const role = sessionStorage.getItem('role');
    if (role === 'biomedical_engineer') {
      alert('You are not allowed to delete sessions');
      return;
    }

    if (!window.confirm('Delete this session?')) return;

    try {
      await fetch(`http://localhost:5001/api/sessions/${idsession}`, {
        method: 'DELETE',
        headers: {
          'x-user-role': role || '',
        },
      });
      setSessions(prev => prev.filter(s => s.idsession !== idsession));
    } catch (err) {
      console.error(err);
      alert('Error deleting session');
    }
  };

  return (
    <>
     
      <div className="container extra-wide page-sessions-biomedical">
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
                {sessionStorage.getItem('role') !== 'biomedical_engineer' && <th>Actions</th>}
              </tr>
            </thead>

            <tbody>
              {sessions.length === 0 ? (
                <tr>
                  <td colSpan={sessionStorage.getItem('role') !== 'biomedical_engineer' ? "7" : "6"}>No sessions found.</td>
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
                    {sessionStorage.getItem('role') !== 'biomedical_engineer' && (
                      <td>
                        <button
                          className="action-btn action-btn--delete"
                          onClick={() => deleteSession(session.idsession)}
                          aria-label="Delete session"
                        >
                          🗑️
                        </button>
                      </td>
                    )}
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
