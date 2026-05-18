import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'


import '../styles/components.css'
import '../styles/patients.css'
import { Link } from 'react-router-dom';

function Patients() {
  const { idUser } = useParams() // physiotherapist id
  const navigate = useNavigate()
  const isAdmin = sessionStorage.getItem('role') === 'admin'

  const [patients, setPatients] = useState([])
  const [filterText, setFilterText] = useState('')
  const [physioName, setPhysioName] = useState('Physiotherapist')
  
  const [editForm, setEditForm] = useState({
    name: '',
    birthdate: '',
    sexe: 1,
    
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



  // ✅ Delete patient (reject appointment)
  const deletePatient = async (event, idpatient) => {
    event.stopPropagation()
    if (!window.confirm('Remove this patient from your list?')) return
    try {
      await fetch(`http://localhost:5001/api/patients/${idpatient}/reject/${idUser}`, { method: 'PUT' })
      fetchPatients()
    } catch (err) { console.error(err) }
  }

 





  return (
    <>

      <div className="container wide page-patients">
        
        <p><strong>Physiotherapist:</strong> {physioName}</p>
        <h2>Patients List</h2>

        <input
          type="text"
          className="filter-input"
          placeholder="Filter patients by name, sex, age"
          value={filterText}
          onChange={e => setFilterText(e.target.value)}
        />

        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Sex</th>
              <th>Age</th>
              
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
                
                <td>
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

  =


    </>
  )
}

export default Patients
