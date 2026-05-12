import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/treatmentPlan.css';

const TreatmentPlan = () => {
    const { idpatient } = useParams();
    const navigate = useNavigate();
    const idUser = sessionStorage.getItem('idUser');

    const [plans, setPlans] = useState([]);
    const [medicalHistory, setMedicalHistory] = useState({
        diagnostics: [],
        injuries: []
    });
    const [editingPlan, setEditingPlan] = useState(null);
    const [formData, setFormData] = useState({
        plan_name: '', description: '', start_date: '', end_date: '', status: 'started'
    });

    useEffect(() => {
        fetchPlans();
        fetchMedicalHistory();
    }, [idpatient]);

    const fetchPlans = async () => {
        const res = await fetch(`http://localhost:5001/api/treatment-plans/${idpatient}`);
        const data = await res.json();
        setPlans(data);
    };

    const fetchMedicalHistory = async () => {
        try {
            const res = await fetch(`http://localhost:5001/api/patient-medical-history/${idpatient}`);
            const data = await res.json();
            setMedicalHistory({
                diagnostics: Array.isArray(data?.diagnostics) ? data.diagnostics : [],
                injuries: Array.isArray(data?.injuries) ? data.injuries : []
            });
        } catch (error) {
            console.error('Failed to load medical history:', error);
            setMedicalHistory({ diagnostics: [], injuries: [] });
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const normalizePlanId = (plan) => plan?.idplan ?? plan?.idPlan ?? plan?.id;

    const formatDateValue = (value) => {
        if (!value) return '';
        const dateString = typeof value === 'string' ? value : new Date(value).toISOString();
        return dateString.split('T')[0];
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const planId = normalizePlanId(editingPlan);
        const url = editingPlan
            ? `http://localhost:5001/api/treatment-plans/${planId}`
            : `http://localhost:5001/api/treatment-plans`;

        try {
            const response = await fetch(url, {
                method: editingPlan ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...formData, idpatient, idUser })
            });

            const data = await response.json();
            if (!response.ok || data.success !== true) {
                console.error('Treatment plan save failed', data);
                return;
            }

            setEditingPlan(null);
            setFormData({ plan_name: '', description: '', start_date: '', end_date: '', status: 'started' });
            await fetchPlans();
        } catch (error) {
            console.error('Failed to save treatment plan:', error);
        }
    };

    const startEdit = (plan) => {
        setEditingPlan(plan);
        setFormData({
            plan_name: plan.plan_name,
            description: plan.description,
            start_date: formatDateValue(plan.start_date),
            end_date: formatDateValue(plan.end_date),
            status: plan.status || 'started'
        });
    };

    return (
        <div className="treatment-container">
            <button className="back-btn2" onClick={() => navigate(-1)}>
                ← Back to Sessions
            </button>
            {/* Medical History Section */}
            <div className="medical-history-section">
                <div className="history-card">
                    <h3>Last Diagnostics</h3>
                    {/* Use ?.length and check for existence */}
                    {medicalHistory?.diagnostics?.length > 0 ? (
                        medicalHistory?.diagnostics?.map(d => (
                            <div key={d.idDiagnostic} className="history-item">
                                <p> <strong>{d.diagnosis_name}</strong>: {d.description}</p>

                                <p>Date: {new Date(d.date_diagnosed).toLocaleDateString()}</p>
                            </div>
                        ))
                    ) : <p>No diagnostics found.</p>}
                </div>
                <div className="history-card">
                    <h3>Injury History</h3>
                    {medicalHistory?.injuries?.length > 0 ? (
                        medicalHistory.injuries.map(i => (
                            <div key={i.idinjury} className="history-item">
                                <p> <strong>{i.injury_name}</strong>: {i.Details}</p>
                                <p>Date: {new Date(i.injury_date).toLocaleDateString()}</  p>
                            </div>
                        ))
                    ) : <p>No injuries recorded.</p>}
                </div>
            </div>

            <form onSubmit={handleSubmit} className="plan-form">
                <h3>{editingPlan ? "Update Plan" : "Create New Treatment Plan"}</h3>
                <div className="form-group">
                    <input type="text" name="plan_name" placeholder="Plan Name" value={formData.plan_name} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                    <textarea name="description" placeholder="Description" value={formData.description} onChange={handleInputChange} required />
                </div>
                <div className="date-row">
                    <div className="form-group">
                        <label>Start Date</label>
                        <input type="date" name="start_date" value={formData.start_date} onChange={handleInputChange} required />
                    </div>
                    <div className="form-group">
                        <label>End Date</label>
                        <input type="date" name="end_date" value={formData.end_date} onChange={handleInputChange} required />
                    </div>
                </div>
                <div className="form-group">
                    <select name="status" value={formData.status} onChange={handleInputChange}>
                        <option value="started">Started</option>
                        <option value="finished">Finished</option>
                        <option value="canceled">Canceled</option>
                    </select>
                </div>
                <button type="submit" className="btn-save">{editingPlan ? "Update Plan" : "Save Plan"}</button>
                {editingPlan && <button type="button" className="btn-cancel" onClick={() => setEditingPlan(null)}>Cancel</button>}
            </form>

            <div className="plans-grid">
                {plans.map(plan => {
                    const planId = normalizePlanId(plan);
                    return (
                        <div key={planId || plan.plan_name} className="plan-card">
                            <div className="plan-header">
                                <h4 className="plan-title">{plan.plan_name}</h4>
                                <span className={`status-badge status-${plan.status}`}>{plan.status}</span>
                            </div>
                            <p className="plan-desc">{plan.description}</p>
                            <div className="plan-dates">
                                <span>📅 {new Date(plan.start_date).toLocaleDateString()}</span>
                                <span>🏁 {new Date(plan.end_date).toLocaleDateString()}</span>
                            </div>
                            <button onClick={() => startEdit(plan)} className="btn-edit">Edit</button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default TreatmentPlan;