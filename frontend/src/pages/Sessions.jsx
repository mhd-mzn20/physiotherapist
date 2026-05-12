import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import '../styles/components.css'
import '../styles/sessions-biomedical.css'

function Sessions() {
  const { iduser, idpatient } = useParams()
  const navigate = useNavigate()

  const [sessions, setSessions] = useState([])
  const [physioName, setPhysioName] = useState('')
  const [patientName, setPatientName] = useState('')

  useEffect(() => {
    fetch(`http://localhost:5001/api/users/${iduser}`)
      .then(res => res.json())
      .then(data => setPhysioName(data.fullname || 'Physiotherapist'))
      .catch(err => console.error(err))
  }, [iduser])

  useEffect(() => {
    fetch(`http://localhost:5001/api/patients/details/${idpatient}`)
      .then(res => res.json())
      .then(data => setPatientName(data.name || 'Patient'))
      .catch(err => console.error(err))
  }, [idpatient])

  useEffect(() => {
    fetchSessions()
  }, [idpatient])

  const fetchSessions = async () => {
    try {
      const res = await fetch(`http://localhost:5001/api/sessions/${idpatient}`)
      const data = await res.json()
      setSessions(data)
    } catch (err) {
      console.error(err)
    }
  }

  const deleteSession = async (idsession) => {
    const role = sessionStorage.getItem('role');
    if (role === 'biomedical_engineer') {
      alert('You are not allowed to delete sessions');
      return;
    }

    if (!window.confirm('Delete this session?')) return
    try {
      await fetch(`http://localhost:5001/api/sessions/${idsession}`, {
        method: 'DELETE',
        headers: { 'x-user-role': role || '' }
      })
      fetchSessions()
    } catch (err) {
      console.error(err)
    }
  }

  const editSession = (idsession) => {
    navigate(`/therapy/${iduser}/${idpatient}/${idsession}`)
  }

  const addNewSession = () => {
    navigate(`/therapy/${iduser}/${idpatient}`)
  }

  const openTreatmentPlan = () => {
    navigate(`/treatement/${iduser}/${idpatient}`)
  }

  const openVisits = () => {
    navigate(`/visits/${iduser}/${idpatient}`)
  }

  const openVideo = (filename) => {
    navigate(`/video/${filename}`)
  }

  return (
    <>
      
      <div className="container extra-wide page-sessions-biomedical">
        <button className='back-btn2' onClick={() => navigate(-1)} style={{ marginLeft: '12px' }}> ← Back to Patients</button>
        <h2>Therapy Sessions</h2>

        <p><strong>Physiotherapist:</strong> {physioName}</p>
        <p><strong>Patient:</strong> {patientName}</p>

        <table>
          <thead>
            <tr>
              <th>Idsession</th>
              <th>Date</th>
              <th>Test</th>
              <th>Protocol</th>
              <th>Remark</th>
              <th>Videos</th>
              <th>trainings</th>
              <th>Actions</th>
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
    session.videos.map((filename, idx) => (
      <div key={idx}>
        <a href={`/video/${filename}`}>{filename}</a>
      </div>
    ))
  ) : (
    <em>No videos</em>
  )}
</td>
<td> <button className="action-btn action-btn--training" onClick={() => navigate(`/trainings/${session.idsession}`)}>🏋️ Assign</button> </td>

                  <td>
                    
                    <button
  className="action-btn action-btn--edit"
  onClick={() => editSession(session.idsession)}
  aria-label="Edit session"
>
  ✏️
</button>

{sessionStorage.getItem('role') !== 'biomedical_engineer' && (
  <button
    className="action-btn action-btn--delete"
    onClick={() => deleteSession(session.idsession)}
    aria-label="Delete session"
  >
    🗑️
  </button>
)}

                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        <div className="buttons">
          <button className="btn-primary btn1" onClick={addNewSession}>
            Add New Session
          </button>
          <button className="btn-primary btn2" onClick={openTreatmentPlan} style={{ marginLeft: '12px' }}>
            Treatment Plan
          </button>
          <button className="btn-primary btn2" onClick={openVisits} style={{ marginLeft: '12px' }}>
            Visits
          </button>
        </div>
      </div>
   
    </>
  )
}

export default Sessions
