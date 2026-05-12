import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

import '../styles/components.css'
import '../styles/visits.css'

const emptyForm = {
  visit_date: '',
  notes: ''
}

function Visits() {
  const { iduser, idpatient } = useParams()
  const navigate = useNavigate()

  const [visits, setVisits] = useState([])
  const [formData, setFormData] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [physioName, setPhysioName] = useState('')
  const [patientName, setPatientName] = useState('')

  /* ---------- Fetch names ---------- */
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

  /* ---------- Fetch visits ---------- */
  useEffect(() => {
    fetchVisits()
  }, [iduser, idpatient])

  const fetchVisits = async () => {
    setLoading(true)
    try {
      const res = await fetch(`http://localhost:5001/api/visits/${iduser}/${idpatient}`)
      const data = await res.json()
      setVisits(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  /* ---------- Form helpers ---------- */
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const resetForm = () => {
    setFormData(emptyForm)
    setEditingId(null)
    setShowForm(false)
  }

  /* ---------- Create / Update ---------- */
  const handleSubmit = async (e) => {
    e.preventDefault()

    const url = editingId
      ? `http://localhost:5001/api/visits/${editingId}`
      : `http://localhost:5001/api/visits`

    const method = editingId ? 'PUT' : 'POST'

    const body = editingId
      ? formData
      : { ...formData, idUser: iduser, idpatient }

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })

      const data = await res.json()

      if (!res.ok) {
        alert(data.message || 'Operation failed')
        return
      }

      resetForm()
      fetchVisits()
    } catch (err) {
      console.error(err)
      alert('Server error')
    }
  }

  /* ---------- Edit ---------- */
  const startEdit = (v) => {
    setEditingId(v.id_visit)
    setFormData({
      visit_date: v.visit_date ? v.visit_date.split('T')[0] : '',
      notes: v.notes || ''
    })
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  /* ---------- Delete ---------- */
  const handleDelete = async (id_visit) => {
    if (!window.confirm('Delete this visit?')) return
    try {
      await fetch(`http://localhost:5001/api/visits/${id_visit}`, { method: 'DELETE' })
      fetchVisits()
    } catch (err) {
      console.error(err)
    }
  }

  /* ---------- Helpers ---------- */
  const isUpcoming = (dateStr) => {
    const visitDate = new Date(dateStr)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return visitDate >= today
  }

  /* ---------- Render ---------- */
  return (
    <>
      <div className="container extra-wide page-visits">
        {/* Header */}
        <button className="back-btn2" onClick={() => navigate(-1)}>
          ← Back to Sessions
        </button>
        <div className="visits-header">
          <div>
            <h2>📅 Visit Schedule</h2>
            <p className="visits-subtitle">
              <strong>{physioName}</strong> → <strong>{patientName}</strong>
            </p>
          </div>
          <button
            className="visits-add-btn"
            onClick={() => { resetForm(); setShowForm(!showForm) }}
          >
            {showForm ? '✕ Close' : '+ Schedule Visit'}
          </button>
        </div>

        {/* Form */}
        {showForm && (
          <form className="visits-form" onSubmit={handleSubmit}>
            <h3>{editingId ? '✏️ Edit Visit' : '➕ New Visit'}</h3>

            <div className="visits-form-grid">
              <div className="form-field">
                <label>Visit Date </label>
                <input
                  name="visit_date"
                  type="date"
                  min={new Date().toISOString().split('T')[0]}
                  value={formData.visit_date}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-field form-field--full">
                <label>Note for Patient</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows="3"
                  placeholder="e.g. Please bring your previous X-ray reports. Wear comfortable clothing."
                />
              </div>
            </div>

            <div className="visits-form-actions">
              <button type="submit" className="btn-save">
                {editingId ? 'Update Visit' : 'Schedule Visit'}
              </button>
              <button type="button" className="btn-cancel" onClick={resetForm}>
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Visit List */}
        {loading ? (
          <div className="visits-loader">Loading visits...</div>
        ) : visits.length === 0 ? (
          <div className="visits-empty">
            <span className="visits-empty-icon">🗓️</span>
            <p>No visits scheduled for this patient yet.</p>
            <p className="visits-empty-hint">Click "Schedule Visit" to set an upcoming appointment.</p>
          </div>
        ) : (
          <div className="visits-list">
            {visits.map((v) => (
              <div
                key={v.id_visit}
                className={`visit-card ${isUpcoming(v.visit_date) ? 'visit-card--upcoming' : 'visit-card--past'}`}
              >
                <div className="visit-card-left">
                  <div className={`visit-date-badge ${isUpcoming(v.visit_date) ? 'badge--upcoming' : 'badge--past'}`}>
                    <span className="badge-day">
                      {new Date(v.visit_date).getDate()}
                    </span>
                    <span className="badge-month">
                      {new Date(v.visit_date).toLocaleString('default', { month: 'short' })}
                    </span>
                    <span className="badge-year">
                      {new Date(v.visit_date).getFullYear()}
                    </span>
                  </div>
                </div>

                <div className="visit-card-body">
                  <div className="visit-card-status">
                    {isUpcoming(v.visit_date) ? (
                      <span className="status-tag status-tag--upcoming">Upcoming</span>
                    ) : (
                      <span className="status-tag status-tag--past">Past</span>
                    )}
                  </div>
                  {v.notes ? (
                    <p className="visit-note">{v.notes}</p>
                  ) : (
                    <p className="visit-note visit-note--empty">No notes added.</p>
                  )}
                </div>

                <div className="visit-card-actions">
                  <button className="visit-btn visit-btn--edit" onClick={() => startEdit(v)}>
                    ✏️
                  </button>
                  <button className="visit-btn visit-btn--delete" onClick={() => handleDelete(v.id_visit)}>
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Back Button */}
        
      </div>
    </>
  )
}

export default Visits
