import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import '../styles/components.css'
import '../styles/therapy.css'

function Therapy() {
  const navigate = useNavigate()
  const { iduser, idpatient, idsession } = useParams()

  const isEditMode = !!idsession

  const [physioName, setPhysioName] = useState('')
  const [patientName, setPatientName] = useState('')

  const [sessiondate, setSessiondate] = useState(
    new Date().toISOString().split('T')[0]
  )
  const [test, setTest] = useState('')
  const [protocol, setProtocol] = useState('')
  const [remark, setRemark] = useState('')
  const [videos, setVideos] = useState(null)
  const [existingVideos, setExistingVideos] = useState([])

  const [loading, setLoading] = useState(false)

  /* =========================
     FETCH NAMES
  ========================= */
  useEffect(() => {
    fetch(`http://localhost:5001/api/users/${iduser}`)
      .then(res => res.json())
      .then(data => setPhysioName(data.fullname || 'Physiotherapist'))
      .catch(console.error)
  }, [iduser])

  useEffect(() => {
    fetch(`http://localhost:5001/api/patients/details/${idpatient}`)
      .then(res => res.json())
      .then(data => setPatientName(data.name || 'Patient'))
      .catch(console.error)
  }, [idpatient])

  /* =========================
     FETCH SESSION (EDIT MODE)
  ========================= */
  useEffect(() => {
    if (!isEditMode) return

    fetch(`http://localhost:5001/api/sessions/${idpatient}`)
      .then(res => res.json())
      .then(data => {
        const session = data.find(s => s.idsession == idsession)
        if (!session) return

        setSessiondate(session.sessiondate.split('T')[0])
        setTest(session.test)
        setProtocol(session.protocol || '')
        setRemark(session.remark || '')
        setExistingVideos(session.videos || [])
      })
      .catch(console.error)
  }, [idsession, idpatient, isEditMode])

  /* =========================
     SAVE (CREATE OR UPDATE)
  ========================= */
  const save = async () => {
    if (!test) {
      alert('Test field is required')
      return
    }

    try {
      setLoading(true)

      const formData = new FormData()
      formData.append('sessiondate', sessiondate)
      formData.append('test', test)
      formData.append('protocol', protocol)
      formData.append('remark', remark)

      if (!isEditMode) {
        formData.append('idphysiotherapist', iduser)
        formData.append('idpatient', idpatient)
      }

      if (videos) {
        for (let i = 0; i < videos.length; i++) {
          formData.append('videos', videos[i])
        }
      }

      const url = isEditMode
        ? `http://localhost:5001/api/sessions/${idsession}`
        : `http://localhost:5001/api/sessions`

      const method = isEditMode ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        body: formData
      })

      if (!response.ok) {
        const errData = await response.json()
        throw new Error(errData.message || 'Operation failed')
      }

      alert(isEditMode ? 'Session updated successfully' : 'Session created successfully')
      navigate(`/sessions/${iduser}/${idpatient}`)

    } catch (error) {
      console.error(error)
      alert(`Error: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const cancel = () => {
    navigate(`/sessions/${iduser}/${idpatient}`)
  }

  return (
    <>
      

      <div className="container page-therapy">
        <h2>{isEditMode ? 'Edit Therapy Session' : 'New Therapy Session'}</h2>

        <p><strong>Physiotherapist:</strong> {physioName}</p>
        <p><strong>Patient:</strong> {patientName}</p>

        <label>Date *</label>
        <input
          type="date"
          value={sessiondate}
          onChange={(e) => setSessiondate(e.target.value)}
        />

        <label>Test *</label>
        <input
          value={test}
          onChange={(e) => setTest(e.target.value)}
        />

        <label>Protocol</label>
        <textarea
          value={protocol}
          onChange={(e) => setProtocol(e.target.value)}
        />

        <label>Upload New Videos</label>
        <input
          type="file"
          multiple
          onChange={(e) => setVideos(e.target.files)}
        />

        {/* Show existing videos in edit mode */}
        {isEditMode && existingVideos.length > 0 && (
          <>
            <label>Existing Videos</label>
            <div className="existing-videos">
              {existingVideos.map((file, index) => (
                <div key={index}>
                  <a
                    href={`http://localhost:5001/uploads/${file}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {file}
                  </a>
                </div>
              ))}
            </div>
          </>
        )}

        <label>Remark</label>
        <textarea
          value={remark}
          onChange={(e) => setRemark(e.target.value)}
        />

        <div className="buttons">
          <button
            className="btn-primary"
            onClick={save}
            disabled={loading}
          >
            {loading
              ? (isEditMode ? 'Updating...' : 'Saving...')
              : (isEditMode ? 'Update' : 'Submit')}
          </button>

          <button
            className="btn-secondary"
            onClick={cancel}
          >
            Cancel
          </button>
        </div>
      </div>

    </>
  )
}

export default Therapy
