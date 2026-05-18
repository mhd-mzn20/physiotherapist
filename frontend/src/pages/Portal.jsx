import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import '../styles/components.css';
import '../styles/portal.css';

function Portal() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [roleFilter, setRoleFilter] = useState('all');
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({
    fullname: '',
    email: '',
    telephone: '',
    username: '',
    password: '',
    role: '',
  });

  // ✅ Protect route: only admin
  useEffect(() => {
    const role = sessionStorage.getItem('role');
    if (!role || role !== 'admin') {
      navigate('/login');
    } else {
      fetchUsers();
    }
  }, [navigate]);

  // ✅ Fetch all users
  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/users');
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };

  // ✅ Delete user
  const handleDelete = async (idUser) => {
    if (!window.confirm('Delete this user?')) return;
    try {
      await fetch(`http://localhost:5001/api/users/${idUser}`, { method: 'DELETE' });
      fetchUsers();
    } catch (err) {
      console.error('Error deleting user:', err);
    }
  };

  // ✅ Edit user
  const handleEdit = (user) => {
    setEditingUser(user);
    setEditForm({
      fullname: user.fullname || '',
      email: user.email || '',
      telephone: user.telephone || '',
      username: user.username || '',
      password: '',
      role: user.role || '',
    });
  };

  const handleEditSave = async (e) => {
    e.preventDefault();
    if (!editingUser) return;

    try {
      await fetch(`http://localhost:5001/api/users/${editingUser.idUser}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      });

      setEditingUser(null);
      fetchUsers();
    } catch (err) {
      console.error('Error updating user:', err);
    }
  };

  const handleEditCancel = () => setEditingUser(null);


  const handleLogout = () => {
    sessionStorage.clear();
    navigate('/login');
  };

  // ✅ Navigate to user's page based on role (allow admin to view)
  const handleRoleOpen = (user) => {
    const role = (user.role || '').toLowerCase();

    if (role === 'physiotherapist') {
      navigate(`/patients/${user.idUser}`);
    } else if (role === 'biomedical_engineer') {
      navigate(`/patients-biomedical/${user.idUser}`);
    }
  };

  return (
    <div className="portal-page">

      <div className="portal-users">
        <h3>Users</h3>

        <div className="portal-filter">
          <label htmlFor="role-filter">Filter by Role:</label>
          <select
            id="role-filter"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="all">All</option>
            <option value="physiotherapist">Physiotherapist</option>
            <option value="biomedical_engineer">Biomedical Engineer</option>
          </select>
        </div>

        <table>
          <thead>
            <tr>
              <th>Full Name</th>
              <th>Role</th>
              <th>Actions</th>

            </tr>
          </thead>

          <tbody>
            {(() => {
              const filtered = users.filter((u) => {
                if ((u.role || '').toLowerCase() === 'admin') return false;
                if (roleFilter === 'all') return true;
                return (u.role || '').toLowerCase() === roleFilter;
              });
              return filtered.length === 0 ? (
                <tr>
                  <td colSpan="3">No users found.</td>
                </tr>
              ) : (
                filtered.map((user) => (
                  <tr key={user.idUser}>
                    <td>{user.fullname}  </td>


                    <td>
                      <button className="role-button" onClick={() => handleRoleOpen(user)}>
                        {user.role.replace('_', ' ')}
                      </button>
                    </td>

                    <td>
                      <div className="portal-actions">

                        <button className="btn-secondary" onClick={() => handleEdit(user)}>
                          ✏️
                        </button>
                        <button className="btn-secondary" onClick={() => handleDelete(user.idUser)}>
                          🗑️
                        </button>

                      </div>
                    </td>

                  </tr>
                ))
              );
            })()}
          </tbody>
        </table>
      </div>

      {editingUser && (
        <div className="portal-modal">
          <div className="portal-modal__content">
            <h3>Edit User</h3>

            <form onSubmit={handleEditSave}>
              <label>Full Name</label>
              <input
                type="text"
                value={editForm.fullname}
                onChange={(e) => setEditForm({ ...editForm, fullname: e.target.value })}
                required
              />

              <label>Email</label>
              <input
                type="email"
                value={editForm.email}
                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                required
              />

              <label>Telephone</label>
              <input
                type="tel"
                value={editForm.telephone}
                onChange={(e) => setEditForm({ ...editForm, telephone: e.target.value })}
              />

              <label>Username</label>
              <input
                type="text"
                value={editForm.username}
                onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                required
              />

              <label>Password</label>
              <input
                type="password"
                placeholder="Leave blank to keep current password"
                value={editForm.password}
                onChange={(e) => setEditForm({ ...editForm, password: e.target.value })}
              />

              <label>Role</label>
              <select
                value={editForm.role}
                onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                required
              >
                <option value="">-- Select Role --</option>
                <option value="physiotherapist">Physiotherapist</option>
                <option value="biomedical_engineer">Biomedical Engineer</option>
                <option value="admin">Admin</option>
              </select>

              <div className="buttons">
                <button className="btn-primary" type="submit">
                  Save
                </button>
                <button className="btn-secondary" type="button" onClick={handleEditCancel}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}


    </div>
  );
}

export default Portal;
