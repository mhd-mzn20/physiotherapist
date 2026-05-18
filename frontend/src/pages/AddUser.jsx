import { useState } from 'react'
import { useNavigate } from 'react-router-dom'



import '../styles/add-user.css'

function AddUser() {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    name: '',
    email: '',
    tel: '',
    username: '',
    password: '',
    role: '',
  })

  const [loading, setLoading] = useState(false)

  const handleChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!form.name || !form.email || !form.tel || !form.username || !form.password || !form.role) {
      alert('Please fill in all required fields')
      return
    }

    try {
      setLoading(true)

      const response = await fetch('http://localhost:5001/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullname: form.name.trim(),
          email: form.email.trim(),
          telephone: form.tel.trim(),
          username: form.username.trim(),
          password: form.password.trim(),
          role: form.role,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to add user')
      }

      alert('User added successfully')

      setForm({
        name: '',
        email: '',
        tel: '',
        username: '',
        password: '',
        role: '',
      })

      navigate('/portal')
    } catch (error) {
      console.error('Error:', error)
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    navigate('/portal')
  }

  return (
    <>

      <div className="page-center page-add-user">

        <button className="back-btn2" onClick={() => navigate('/portal')} style={{ marginBottom: '16px', width: '160px' }}>
          ←Back to Portal
        </button >
        <h2>Add User</h2>

        <form onSubmit={handleSubmit}>
          <label>Full Name</label>
          <input
            type="text"
            name="name"
            placeholder="Enter full name"
            value={form.name}
            onChange={handleChange}
            required
          />

          <label>Email</label>
          <input
            type="email"
            name="email"
            placeholder="Enter email"
            value={form.email}
            onChange={handleChange}
            required
          />

          <label>Telephone</label>
          <input
            type="tel"
            name="tel"
            placeholder="Enter phone number"
            value={form.tel}
            onChange={handleChange}
            required
          />

          <label>Username</label>
          <input
            type="text"
            name="username"
            placeholder="Enter username"
            value={form.username}
            onChange={handleChange}
            required
          />

          <label>Password</label>
          <input
            type="password"
            name="password"
            placeholder="Enter password"
            value={form.password}
            onChange={handleChange}
            required
          />

          <label>Role</label>
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            required
          >
            <option value="">-- Select Role --</option>
            <option value="physiotherapist">Physiotherapist</option>
            <option value="biomedical_engineer">Biomedical Engineer</option>
          </select>

          <button type="submit" disabled={loading} className='btn-add'>
            {loading ? 'Adding...' : 'Add User'}
          </button>

          <button type="button" onClick={handleCancel} className='btn-cancel'>
            Cancel
          </button>
        </form>

      </div>

    </>
  )
}

export default AddUser
