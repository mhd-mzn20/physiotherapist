import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'

import '../styles/components.css'
import '../styles/biomedical.css'

function Biomedical() {
  const { idengineer, idphysiotherapist, idpatient } = useParams()

  const [engineerName, setEngineerName] = useState('')
  const [physioName, setPhysioName] = useState('')
  const [patientName, setPatientName] = useState('')

  const [testType, setTestType] = useState('')
  const [testDate, setTestDate] = useState('')
  const [testValue, setTestValue] = useState('')
  const [notes, setNotes] = useState('')

  // New files to upload
  const [newCsvFiles, setNewCsvFiles] = useState([])
  const [newImages, setNewImages] = useState([])
  const [previewImages, setPreviewImages] = useState([])

  // Existing files
  const [existingCsvFiles, setExistingCsvFiles] = useState([]) // {idfile, filename}
  const [existingImages, setExistingImages] = useState([])     // {idfile, filename}

  const [biomedicalRecords, setBiomedicalRecords] = useState([])
  const [editingId, setEditingId] = useState(null)

  /* =========================
     Fetch names
  ========================= */
  useEffect(() => {
    if (idengineer) {
      fetch(`http://localhost:5001/api/users/${idengineer}`)
        .then(res => res.json())
        .then(data => setEngineerName(data.fullname || 'Biomedical Engineer'))
        .catch(console.error)
    }

    if (idpatient) {
      const fetchPatientAndPhysio = async () => {
        try {
          const resPatient = await fetch(
            `http://localhost:5001/api/patients/details/${idpatient}`
          )
          const patientData = await resPatient.json()
          setPatientName(patientData.name)

          if (patientData.idphysiotherapist) {
            const resPhysio = await fetch(
              `http://localhost:5001/api/users/${patientData.idphysiotherapist}`
            )
            const physioData = await resPhysio.json()
            setPhysioName(physioData.fullname || '')
          }
        } catch (err) {
          console.error(err)
        }
      }
      fetchPatientAndPhysio()
    }
  }, [idengineer, idpatient])

  /* =========================
     Fetch biomedical records
  ========================= */
  useEffect(() => {
    if (!idpatient) return
    const fetchRecords = async () => {
      try {
        const res = await fetch(`http://localhost:5001/api/biomedical/${idpatient}`)
        const data = await res.json()
        setBiomedicalRecords(data)
      } catch (err) {
        console.error(err)
      }
    }
    fetchRecords()
  }, [idpatient])

  /* =========================
     Image preview
  ========================= */
  const handleImagePreview = files => {
    const previews = Array.from(files).map(f => URL.createObjectURL(f))
    setPreviewImages(prev => [...prev, ...previews])
  }

  /* =========================
     Submit form (add/update)
  ========================= */
  const handleSubmit = async e => {
    e.preventDefault()

    if (!testType || !testDate) {
      alert('Please fill required fields')
      return
    }

    const formData = new FormData()
    formData.append('idengineer', idengineer)
    formData.append('idphysiotherapist', idphysiotherapist)
    formData.append('idpatient', idpatient)
    formData.append('visitdate', testDate)
    formData.append('testtype', testType)
    formData.append('testvalue', testValue)
    formData.append('note', notes)

    newCsvFiles.forEach(f => formData.append('csvFiles', f))
    newImages.forEach(f => formData.append('graphImages', f))

    try {
      let url = 'http://localhost:5001/api/biomedical'
      let method = 'POST'
      if (editingId) {
        url += `/${editingId}`
        method = 'PUT'
      }

      const response = await fetch(url, { method, body: formData })
      const data = await response.json()

      if (response.ok) {
        alert(editingId ? 'Record updated!' : 'Record saved successfully!')

        // Clear form
        setTestType('')
        setTestDate('')
        setTestValue('')
        setNotes('')
        setNewCsvFiles([])
        setNewImages([])
        setPreviewImages([])
        setExistingCsvFiles([])
        setExistingImages([])
        setEditingId(null)

        // Refresh records
        const updatedRes = await fetch(`http://localhost:5001/api/biomedical/${idpatient}`)
        const updatedData = await updatedRes.json()
        setBiomedicalRecords(updatedData)
      } else {
        alert(data.message || 'Error saving record')
      }
    } catch (err) {
      console.error(err)
      alert('Server error')
    }
  }

  /* =========================
     Delete biomedical record
  ========================= */
  const handleDelete = async id => {
    if (!window.confirm('Are you sure you want to delete this record?')) return
    try {
      const res = await fetch(`http://localhost:5001/api/biomedical/${id}`, { method: 'DELETE' })
      const data = await res.json()
      alert(data.message)
      setBiomedicalRecords(prev => prev.filter(r => r.idbiomedical !== id))
    } catch (err) {
      console.error(err)
      alert('Delete failed')
    }
  }

  /* =========================
     Edit record
  ========================= */
  const handleEdit = record => {
    setEditingId(record.idbiomedical)
    setTestType(record.testtype)
    setTestDate(record.visitdate ? new Date(record.visitdate).toISOString().split('T')[0] : '')
    setTestValue(record.testvalue || '')
    setNotes(record.note || '')

    // Separate old files
    const csvs = record.files.filter(f => f.filetype === 'csv')
    const imgs = record.files.filter(f => f.filetype === 'image')

    setExistingCsvFiles(csvs)
    setExistingImages(imgs)
    setPreviewImages(imgs.map(f => `http://localhost:5001/uploads/${f.filename}`))

    setNewCsvFiles([])
    setNewImages([])
  }

  /* =========================
     Remove existing file
  ========================= */
  const handleRemoveExistingFile = async file => {
    if (!window.confirm(`Delete ${file.filename}?`)) return
    try {
      const res = await fetch(`http://localhost:5001/api/biomedical/file/${file.idfile}`, { method: 'DELETE' })
      const data = await res.json()
      alert(data.message)

      if (file.filetype === 'csv') {
        setExistingCsvFiles(prev => prev.filter(f => f.idfile !== file.idfile))
      } else {
        setExistingImages(prev => prev.filter(f => f.idfile !== file.idfile))
        setPreviewImages(prev => prev.filter(url => !url.endsWith(file.filename)))
      }
    } catch (err) {
      console.error(err)
      alert('Failed to delete file')
    }
  }

  return (
    <>
      
      <div className="container page-biomedical">
        <h2>Biomedical Information</h2>
        <p><strong>Biomedical Engineer:</strong> {engineerName}</p>
        <p><strong>Physiotherapist:</strong> {physioName}</p>
        <p><strong>Patient:</strong> {patientName}</p>

        <form onSubmit={handleSubmit}>
          <label>Select Test Type</label>
          <select value={testType} onChange={e => setTestType(e.target.value)} required>
            <option value="">-- Select Test --</option>
            <option value="EMG">EMG</option>
            <option value="EEG">EEG</option>
            <option value="ECG">ECG</option>
            <option value="Blood Pressure">Blood Pressure</option>
            <option value="SpO2">SpO₂</option>
            <option value="Temperature">Temperature</option>
            <option value="Respiratory Rate">Respiratory Rate</option>
          </select>

          <label>Test Date</label>
          <input type="date" value={testDate} onChange={e => setTestDate(e.target.value)} required />

          <label>Test Value</label>
          <input type="text" value={testValue} onChange={e => setTestValue(e.target.value)} />

          <label>Existing CSV Files</label>
          {existingCsvFiles.map(f => (
            <div key={f.idfile}>
              <a href={`http://localhost:5001/uploads/${f.filename}`} target="_blank">{f.filename}</a>
              <button
  type="button"
  onClick={() => handleRemoveExistingFile(f)}
  style={{
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '16px',
    marginLeft: '5px'
  }}
  title="Remove file"
>
  🗑️
</button>

            </div>
          ))}
          <label>Add New CSV Files</label>
          <input type="file" accept=".csv" multiple onChange={e => setNewCsvFiles(Array.from(e.target.files))} />

          <label>Existing Graph Images</label>
          {existingImages.map(f => (
            <div key={f.idfile}>
              <img src={`http://localhost:5001/uploads/${f.filename}`} width="50" />
              <button
  type="button"
  onClick={() => handleRemoveExistingFile(f)}
  style={{
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '16px',
    marginLeft: '5px'
  }}
  title="Remove file"
>
  🗑️
</button>

            </div>
          ))}
          <label>Add New Graph Images</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={e => {
              const files = Array.from(e.target.files)
              setNewImages(files)
              handleImagePreview(files)
            }}
          />

          {previewImages.length > 0 && (
            <div className="image-preview">
              <p>Image Preview:</p>
              {previewImages.map((img, i) => (
                <img key={i} src={img} alt="Preview" width="50" style={{ margin: '5px' }} />
              ))}
            </div>
          )}

          <label>Notes</label>
          <textarea value={notes} onChange={e => setNotes(e.target.value)} />

          <button type="submit">{editingId ? 'Update Biomedical Data' : 'Save Biomedical Data'}</button>
        </form>

        <h3>Existing Records</h3>
        {biomedicalRecords.length === 0 ? (
          <p>No records yet</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Test Type</th>
                <th>Test Value</th>
                <th>Notes</th>
                <th>Engineer</th>
                <th>Files</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {biomedicalRecords.map(record => (
                <tr key={record.idbiomedical}>
                  <td>{record.visitdate ? new Date(record.visitdate).toISOString().split('T')[0] : ''}</td>
                  <td>{record.testtype}</td>
                  <td>{record.testvalue}</td>
                  <td>{record.note}</td>
                  <td>{record.engineer_name}</td>
                  <td>
                    {record.files.map(f => (
                      <div key={f.idfile}>
                        {f.filetype === 'csv' ? (
                          <a href={`http://localhost:5001/uploads/${f.filename}`} target="_blank">{f.filename}</a>
                        ) : (
                          <img src={`http://localhost:5001/uploads/${f.filename}`} width="50" />
                        )}
                      </div>
                    ))}
                  </td>
                  <td>
                  <button
  onClick={() => handleEdit(record)}
  style={{
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '18px',
    marginRight: '5px'
  }}
  title="Edit record"
>
  ✏️
</button>

<button
  onClick={() => handleDelete(record.idbiomedical)}
  style={{
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '18px'
  }}
  title="Delete record"
>
  🗑️
</button>

                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <Link to={`/patients-biomedical/${idengineer}`} className="back-btn">← Back to Patients</Link>
      </div>
     
    </>
  )
}

export default Biomedical
