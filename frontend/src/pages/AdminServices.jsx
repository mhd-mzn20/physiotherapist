import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/adminServices.css';

function AdminServices() {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const emptyForm = { title: '', description: '', subDesc: '', icon: '' };
  const [newForm, setNewForm] = useState({ ...emptyForm });
  const [adding, setAdding] = useState(false);


  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ ...emptyForm });

  // Protect: admin only
  useEffect(() => {
    const role = sessionStorage.getItem('role');
    if (!role || role !== 'admin') { navigate('/login'); return; }
    fetchServices();
  }, [navigate]);

  const fetchServices = () => {
    setLoading(true);
    fetch('http://localhost:5001/api/services')
      .then(r => r.json())
      .then(data => { setServices(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  };

  // ── Add ──
  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newForm.title.trim()) return;
    setAdding(true);
    try {
      const res = await fetch('http://localhost:5001/api/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newForm.title.trim(),
          description: newForm.description.trim(),
          subDesc: newForm.subDesc.trim(),
          icon: newForm.icon.trim(),
        }),
      });
      if (!res.ok) throw new Error('Failed to add service');
      setNewForm({ ...emptyForm });
      fetchServices();
    } catch (err) { alert(err.message); }
    finally { setAdding(false); }
  };

  // ── Edit ──
  const startEdit = (svc) => {
    setEditingId(svc.idService);
    setEditForm({
      title: svc.title || '',
      description: svc.description || '',
      subDesc: svc.subDesc || '',
      icon: svc.icon || '',
    });
  };
  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({ ...emptyForm });
  };

  const handleUpdate = async (idService) => {
    if (!editForm.title.trim()) return;
    try {
      const res = await fetch(`http://localhost:5001/api/services/${idService}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: editForm.title.trim(),
          description: editForm.description.trim(),
          subDesc: editForm.subDesc.trim(),
          icon: editForm.icon.trim(),
        }),
      });
      if (!res.ok) throw new Error('Failed to update service');
      cancelEdit();
      fetchServices();
    } catch (err) { alert(err.message); }
  };

  // ── Delete ──
  const handleDelete = async (idService) => {
    if (!window.confirm('Delete this service?')) return;
    try {
      const res = await fetch(`http://localhost:5001/api/services/${idService}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete service');
      fetchServices();
    } catch (err) { alert(err.message); }
  };

  return (
    <div className="admin-services-page">

      {/* Page header */}
      <div className="as-header">
        <div className="as-title-group">
          <h1>Services</h1>
          <span className="as-count">{services.length} service{services.length !== 1 ? 's' : ''}</span>
        </div>
      </div>

      {/* Add service form */}
      <div className="as-card">
        <h2>Add New Service</h2>
        <form className="as-add-form" onSubmit={handleAdd}>
          <input
            type="text"
            className="as-input"
            placeholder="Service title…"
            value={newForm.title}
            onChange={e => setNewForm(prev => ({ ...prev, title: e.target.value }))}
            required
          />
          <input
            type="text"
            className="as-input"
            placeholder="Description…"
            value={newForm.description}
            onChange={e => setNewForm(prev => ({ ...prev, description: e.target.value }))}
          />
          <input
            type="text"
            className="as-input"
            placeholder="Sub-Description…"
            value={newForm.subDesc}
            onChange={e => setNewForm(prev => ({ ...prev, subDesc: e.target.value }))}
          />
          <input
            type="text"
            className="as-input"
            placeholder="Icon (URL or class)…"
            value={newForm.icon}
            onChange={e => setNewForm(prev => ({ ...prev, icon: e.target.value }))}
          />
          <button type="submit" className="as-btn as-btn--primary" disabled={adding}>
            {adding ? 'Adding…' : '+ Add Service'}
          </button>
        </form>
      </div>

      {/* Services list */}
      <div className="as-card">
        <h2>All Services</h2>

        {loading ? (
          <p className="as-empty">Loading…</p>
        ) : services.length === 0 ? (
          <p className="as-empty">No services yet. Add one above.</p>
        ) : (
          <table className="as-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Title</th>
                <th>Description</th>
                <th>Sub-Description</th>
                <th>Icon</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {services.map((svc, i) => (
                <tr key={svc.idService}>
                  <td className="as-idx">{i + 1}</td>
                  <td className="as-title-cell">
                    {editingId === svc.idService ? (
                      <input
                        className="as-input as-input--inline"
                        value={editForm.title}
                        onChange={e => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                        autoFocus
                      />
                    ) : (
                      <span className="as-service-name">{svc.title}</span>
                    )}
                  </td>
                  <td className="as-desc-cell">
                    {editingId === svc.idService ? (
                      <input
                        className="as-input as-input--inline"
                        value={editForm.description}
                        onChange={e => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                      />
                    ) : (
                      <span>{svc.description}</span>
                    )}
                  </td>
                  <td className="as-subdesc-cell">
                    {editingId === svc.idService ? (
                      <input
                        className="as-input as-input--inline"
                        value={editForm.subDesc}
                        onChange={e => setEditForm(prev => ({ ...prev, subDesc: e.target.value }))}
                      />
                    ) : (
                      <span>{svc.subDesc}</span>
                    )}
                  </td>
                  <td className="as-icon-cell">
                    {editingId === svc.idService ? (
                      <input
                        className="as-input as-input--inline"
                        value={editForm.icon}
                        onChange={e => setEditForm(prev => ({ ...prev, icon: e.target.value }))}
                      />
                    ) : (
                      <span>{svc.icon}</span>
                    )}
                  </td>
                  <td className="as-actions">
                    {editingId === svc.idService ? (
                      <>
                        <button className="as-btn as-btn--save" onClick={() => handleUpdate(svc.idService)}>Save</button>
                        <button className="as-btn as-btn--cancel" onClick={cancelEdit}>Cancel</button>
                      </>
                    ) : (
                      <>
                        <button className="as-btn as-btn--edit" onClick={() => startEdit(svc)}>✏️ Edit</button>
                        <button className="as-btn as-btn--delete" onClick={() => handleDelete(svc.idService)}>🗑️ Delete</button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

    </div>
  );
}

export default AdminServices;
