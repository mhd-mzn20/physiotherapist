import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

import '../styles/components.css'
import '../styles/training.css'

const emptyForm = {
  name: '',
  sets: '',
  reps: '',
  frequency: '',
  assigned_date: new Date().toISOString().split('T')[0]
}

function Trainings() {
  const { idsession } = useParams()
  const navigate = useNavigate()

  const [trainings, setTrainings] = useState([])
  const [formData, setFormData] = useState(emptyForm)
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [editingId, setEditingId] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)

  /* ---------- Fetch ---------- */
  useEffect(() => {
    fetchTrainings()
  }, [idsession])

  const fetchTrainings = async () => {
    setLoading(true)
    try {
      const res = await fetch(`http://localhost:5001/api/trainings/${idsession}`)
      const data = await res.json()
      setTrainings(Array.isArray(data) ? data : [])
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

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImageFile(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const resetForm = () => {
    setFormData(emptyForm)
    setImageFile(null)
    setImagePreview(null)
    setEditingId(null)
    setShowForm(false)
  }

  /* ---------- Create / Update ---------- */
  const handleSubmit = async (e) => {
    e.preventDefault()

    const url = editingId
      ? `http://localhost:5001/api/trainings/${editingId}`
      : `http://localhost:5001/api/trainings`

    const method = editingId ? 'PUT' : 'POST'

    // Build FormData for multipart upload
    const fd = new FormData()
    if (!editingId) fd.append('idsession', idsession)
    fd.append('name', formData.name)
    fd.append('sets', formData.sets)
    fd.append('reps', formData.reps)
    fd.append('frequency', formData.frequency)
    fd.append('assigned_date', formData.assigned_date)
    if (imageFile) fd.append('image', imageFile)

    try {
      const res = await fetch(url, { method, body: fd })
      const data = await res.json()

      if (!res.ok) {
        alert(data.message || 'Operation failed')
        return
      }

      resetForm()
      fetchTrainings()
    } catch (err) {
      console.error(err)
      alert('Server error')
    }
  }

  /* ---------- Edit ---------- */
  const startEdit = (t) => {
    setEditingId(t.train_id)
    setFormData({
      name: t.name,
      sets: t.sets,
      reps: t.reps,
      frequency: t.frequency || '',
      assigned_date: t.assigned_date ? t.assigned_date.split('T')[0] : ''
    })
    setImageFile(null)
    setImagePreview(t.image ? `http://localhost:5001/uploads/${t.image}` : null)
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  /* ---------- Delete ---------- */
  const handleDelete = async (train_id) => {
    if (!window.confirm('Delete this training?')) return
    try {
      await fetch(`http://localhost:5001/api/trainings/${train_id}`, { method: 'DELETE' })
      fetchTrainings()
    } catch (err) {
      console.error(err)
    }
  }

  /* ---------- Render ---------- */
  return (
    <>
      <div className="container extra-wide page-trainings">
         <button className="back-btn2" onClick={() => navigate(-1)}>
          ← Back to Sessions
        </button>
        {/* Header */}
        <div className="trainings-header">
          <div>
            <h2>🏋️ Training Program</h2>
            <p className="trainings-subtitle">Session #{idsession}</p>
          </div>
          <button
            className="trainings-add-btn"
            onClick={() => { resetForm(); setShowForm(!showForm) }}
          >
            {showForm ? '✕ Close' : '+ Add Training'}
          </button>
        </div>

        {/* Form */}
        {showForm && (
          <form className="trainings-form" onSubmit={handleSubmit}>
            <h3>{editingId ? '✏️ Edit Training' : '➕ New Training'}</h3>

            <div className="trainings-form-grid">
              <div className="form-field">
                <label>Exercise Name *</label>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Cat-Camel Stretch"
                  required
                />
              </div>

              <div className="form-field">
                <label>Sets *</label>
                <input
                  name="sets"
                  type="number"
                  min="1"
                  value={formData.sets}
                  onChange={handleChange}
                  placeholder="3"
                  required
                />
              </div>

              <div className="form-field">
                <label>Reps *</label>
                <input
                  name="reps"
                  value={formData.reps}
                  onChange={handleChange}
                  placeholder="12"
                  required
                />
              </div>

              <div className="form-field">
                <label>Frequency</label>
                <input
                  name="frequency"
                  value={formData.frequency}
                  onChange={handleChange}
                  placeholder="Daily, Morning & Evening"
                />
              </div>

              <div className="form-field">
                <label>Assigned Date *</label>
                <input
                  name="assigned_date"
                  type="date"
                  value={formData.assigned_date}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-field">
                <label>Exercise Image</label>
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/gif"
                  onChange={handleFileChange}
                  className="file-input"
                />
              </div>
            </div>

            {/* Image Preview */}
            {imagePreview && (
              <div className="image-preview-box">
                <img src={imagePreview} alt="Preview" />
                <button
                  type="button"
                  className="remove-preview-btn"
                  onClick={() => { setImageFile(null); setImagePreview(null) }}
                >
                  ✕ Remove
                </button>
              </div>
            )}

            <div className="trainings-form-actions">
              <button type="submit" className="btn-save">
                {editingId ? 'Update Training' : 'Save Training'}
              </button>
              <button type="button" className="btn-cancel" onClick={resetForm}>
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Training List */}
        {loading ? (
          <div className="trainings-loader">Loading trainings...</div>
        ) : trainings.length === 0 ? (
          <div className="trainings-empty">
            <span className="trainings-empty-icon">📋</span>
            <p>No trainings assigned to this session yet.</p>
            <p className="trainings-empty-hint">Click "Add Training" above to get started.</p>
          </div>
        ) : (
          <div className="trainings-grid">
            {trainings.map((t) => (
              <div key={t.train_id} className="training-card">
                <div className="training-card-top">
                  {t.image ? (
                    <img
                      className="training-card-thumb"
                      src={`http://localhost:5001/uploads/${t.image}`}
                      alt={t.name}
                    />
                  ) : (
                    <div className="training-card-icon">🏋️</div>
                  )}
                  <div className="training-card-info">
                    <h4>{t.name}</h4>
                    <span className="training-date">
                      📅 {new Date(t.assigned_date).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="training-card-stats">
                  <div className="stat-pill">
                    <span className="stat-label">Sets</span>
                    <span className="stat-value">{t.sets}</span>
                  </div>
                  <div className="stat-pill">
                    <span className="stat-label">Reps</span>
                    <span className="stat-value">{t.reps}</span>
                  </div>
                  {t.frequency && (
                    <div className="stat-pill stat-pill--wide">
                      <span className="stat-label">Frequency</span>
                      <span className="stat-value">{t.frequency}</span>
                    </div>
                  )}
                </div>

                {t.image && (
                  <div className="training-card-image-full">
                    <img src={`http://localhost:5001/uploads/${t.image}`} alt={t.name} />
                  </div>
                )}

                <div className="training-card-actions">
                  <button className="training-btn training-btn--edit" onClick={() => startEdit(t)}>
                    ✏️ Edit
                  </button>
                  <button className="training-btn training-btn--delete" onClick={() => handleDelete(t.train_id)}>
                    🗑️ Delete
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

export default Trainings
