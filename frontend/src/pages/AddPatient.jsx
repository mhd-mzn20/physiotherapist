import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

import '../styles/components.css'
import '../styles/add-patient.css'

function AddPatient() {
  const [name, setName] = useState('')
  const [birthdate, setBirthdate] = useState('')
  const [sex, setSex] = useState(1) // 1 = Male, 2 = Female
  const [diagnostic, setDiagnostic] = useState('')

  const navigate = useNavigate()
  const location = useLocation()

  // ✅ Get idphysiotherapist from location.state
  const idphysiotherapist = location.state?.idphysiotherapist || sessionStorage.getItem('idUser')

  const savePatient = async () => {
    if (!idphysiotherapist) {
      alert('Physiotherapist ID missing!')
      return
    }

    try {
      const response = await fetch('http://localhost:5001/api/patients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          birthdate,
          sex,
          diagnostic: diagnostic.trim(),
          idphysiotherapist,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        alert(data.message || 'Error saving patient')
        return
      }

      alert(data.message)
      navigate(`/patients/${idphysiotherapist}`) // redirect to correct physiotherapist's patient list
    } catch (error) {
      console.error(error)
      alert('Server error')
    }
  }

  const goBack = () => {
    navigate(`/patients/${idphysiotherapist}`)
  }

  return (
    <>
     
      <div className="container page-add-patient">
        <h2>Add Patient</h2>

        <label>Name</label>
        <input value={name} onChange={(e) => setName(e.target.value)} />

        <label>Birthdate</label>
        <input type="date" value={birthdate} onChange={(e) => setBirthdate(e.target.value)} />

        <label>Sex</label>
        <select value={sex} onChange={(e) => setSex(Number(e.target.value))}>
          <option value={1}>Male</option>
          <option value={2}>Female</option>
        </select>

        <label>Diagnostic</label>
        <textarea value={diagnostic} onChange={(e) => setDiagnostic(e.target.value)} />

        <div className="buttons">
          <button className="btn-primary" onClick={savePatient}>
            Save
          </button>
          <button className="btn-secondary" onClick={goBack}>
            Cancel
          </button>
        </div>
      </div>
     
    </>
  )
}

export default AddPatient
