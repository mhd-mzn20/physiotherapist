import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'


import '../styles/components.css'
import '../styles/patients.css'
import { Link } from 'react-router-dom';

function Patients() {
  const { idUser } = useParams() // physiotherapist id
  const navigate = useNavigate()

  const [patients, setPatients] = useState([])
  const [filterText, setFilterText] = useState('')
  const [physioName, setPhysioName] = useState('Physiotherapist')
  const [editingPatient, setEditingPatient] = useState(null)
  const [editForm, setEditForm] = useState({
    name: '',
    birthdate: '',
    sexe: 1,
    diagnostic: ''
  })

  // ✅ Fetch physiotherapist name
  useEffect(() => {
    fetch(`http://localhost:5001/api/users/${idUser}`)
      .then(res => res.json())
      .then(data => setPhysioName(data.fullname || 'Physiotherapist'))
      .catch(err => console.error(err))
  }, [idUser])

  // ✅ Fetch patients
  useEffect(() => { fetchPatients() }, [idUser])

  const fetchPatients = async () => {
    try {
      const res = await fetch(`http://localhost:5001/api/patients/${idUser}`)
      const data = await res.json()
      setPatients(data)
    } catch (err) { console.error(err) }
  }

  // ✅ Calculate age
  const calculateAge = (birthdate) => {
    const today = new Date()
    const birth = new Date(birthdate)
    let age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) age--
    return age
  }

  // ✅ Filtering
  const filteredPatients = useMemo(() => {
    const search = filterText.trim().toLowerCase()
    if (!search) return patients
    return patients.filter(p => {
      const age = calculateAge(p.birthdate)
      const text = `${p.name} ${p.sexe === 1 ? 'Male' : 'Female'} ${age} ${p.diagnostic}`
      return text.toLowerCase().includes(search)
    })
  }, [filterText, patients])

  // ✅ Add new patient
  const addNewPatient = () => {
    navigate('/add-patient', { state: { idphysiotherapist: idUser } })
  }

  // ✅ Delete patient
  const deletePatient = async (event, idpatient) => {
    event.stopPropagation()
    if (!window.confirm('Delete this patient?')) return
    try {
      await fetch(`http://localhost:5001/api/patients/${idpatient}`, { method: 'DELETE' })
      fetchPatients()
    } catch (err) { console.error(err) }
  }

  // ✅ Edit patient modal
  const editPatient = (event, patient) => {
    event.stopPropagation()
    setEditingPatient(patient)
    setEditForm({
      name: patient.name,
      birthdate: patient.birthdate.split('T')[0], // format yyyy-mm-dd
      sexe: patient.sexe,
      diagnostic: patient.diagnostic
    })
  }

  const saveEdit = async (event) => {
    event.preventDefault()
    try {
      await fetch(`http://localhost:5001/api/patients/${editingPatient.idpatient}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm)
      })
      setEditingPatient(null)
      fetchPatients()
    } catch (err) { console.error(err) }
  }

  const cancelEdit = () => setEditingPatient(null)

  return (
    <>
      
      <div className="container wide page-patients">
        <p><strong>Physiotherapist:</strong> {physioName}</p>
        <h2>Patients List</h2>
        <button className="add-btn" onClick={addNewPatient}>+ Add New Patient</button>

        <input
          type="text"
          className="filter-input"
          placeholder="Filter patients by name, sex, age, or diagnostic..."
          value={filterText}
          onChange={e => setFilterText(e.target.value)}
        />

        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Sex</th>
              <th>Age</th>
              <th>Diagnostic</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
  {filteredPatients.length === 0 ? (
    <tr><td colSpan="5">No patients found.</td></tr>
  ) : filteredPatients.map(p => (
    <tr
      key={p.idpatient}
      onClick={() => navigate(`/sessions/${idUser}/${p.idpatient}`)}
      style={{ cursor: 'pointer' }}
    >
      <td>{p.name}</td>
      <td>{p.sexe === 1 ? 'Male' : 'Female'}</td>
      <td>{calculateAge(p.birthdate)}</td>
      <td>{p.diagnostic}</td>
      <td>
       <span
  className="action-btn"
  onClick={e => { e.stopPropagation(); editPatient(e, p); }}
  title="Edit Patient"
>
  ✏️
</span>
<span
  className="action-btn"
  onClick={e => { e.stopPropagation(); deletePatient(e, p.idpatient); }}
  title="Delete Patient"
>
  🗑️
</span>
<Link
  to={`/biomedical-view/${p.idpatient}`}
  className="action-btn"
  onClick={e => e.stopPropagation()}
  title="View Biomedical Info"
>
  🔬
</Link>


         

      </td>
    </tr>
  ))}
</tbody>

        </table>
      </div>

      {/* Edit Modal */}
      {editingPatient && (
        <div className="portal-modal">
          <div className="portal-modal__content">
            <h3>Edit Patient</h3>
            <form onSubmit={saveEdit}>
              <label>Name</label>
              <input
                type="text"
                value={editForm.name}
                onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                required
              />

              <label>Birthdate</label>
              <input
                type="date"
                value={editForm.birthdate}
                onChange={e => setEditForm({ ...editForm, birthdate: e.target.value })}
                required
              />

              <label>Sex</label>
              <select
                value={editForm.sexe}
                onChange={e => setEditForm({ ...editForm, sexe: parseInt(e.target.value) })}
                required
              >
                <option value={1}>Male</option>
                <option value={2}>Female</option>
              </select>

              <label>Diagnostic</label>
              <input
                type="text"
                value={editForm.diagnostic}
                onChange={e => setEditForm({ ...editForm, diagnostic: e.target.value })}
                required
              />

              <div className="buttons">
                <button className="btn-primary" type="submit">Save</button>
                <button className="btn-secondary" type="button" onClick={cancelEdit}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

     
    </>
  )
}

export default Patients
