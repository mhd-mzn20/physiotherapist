import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
  
import '../styles/components.css';
import '../styles/biomedical.css';

function BiomedicalView() {
  const { idpatient } = useParams();
  const idphysio = sessionStorage.getItem('idUser');
  const navigate = useNavigate();
  const [patientName, setPatientName] = useState('');
  const [physioName, setPhysioName] = useState('');
  const [biomedicalRecords, setBiomedicalRecords] = useState([]);

  // Fetch patient & physiotherapist names
  useEffect(() => {
    const fetchNames = async () => {
      try {
        const resPatient = await fetch(
          `http://localhost:5001/api/patients/details/${idpatient}`
        );
        const patientData = await resPatient.json();
        setPatientName(patientData.name);

        if (patientData.idphysiotherapist) {
          const resPhysio = await fetch(
            `http://localhost:5001/api/users/${patientData.idphysiotherapist}`
          );
          const physioData = await resPhysio.json();
          setPhysioName(physioData.fullname || '');
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchNames();
  }, [idpatient]);

  // Fetch biomedical records
  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const res = await fetch(
          `http://localhost:5001/api/biomedical/${idpatient}`
        );
        const data = await res.json();
        setBiomedicalRecords(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchRecords();
  }, [idpatient]);

  // Format date
  const formatDate = isoDate => {
    const d = new Date(isoDate);
    return d.toLocaleDateString(); // e.g., 02/19/2026
  };

  return (
    <>
      
      <div className="container page-biomedical">
        <h2>Biomedical Information</h2>
        <p><strong>Patient:</strong> {patientName}</p>
        <p><strong>Physiotherapist:</strong> {physioName}</p>

        {biomedicalRecords.length === 0 ? (
          <p>No biomedical records available 🔬</p>
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
              </tr>
            </thead>
            <tbody>
              {biomedicalRecords.map(record => (
                <tr key={record.idbiomedical}>
                  <td>{formatDate(record.visitdate)}</td>
                  <td>{record.testtype}</td>
                  <td>{record.testvalue}</td>
                  <td>{record.note}</td>
                  <td>{record.engineer_name}</td>
                  <td>
                    {record.files.map(f => (
                      <div key={f.idfile}>
                        {f.filetype === 'csv' ? (
                          <a
                            href={`http://localhost:5001/uploads/${f.filename}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            📄 {f.filename}
                          </a>
                        ) : (
                          <img
                            src={`http://localhost:5001/uploads/${f.filename}`}
                            alt="Graph"
                            width="50"
                            style={{ margin: '3px' }}
                          />
                        )}
                      </div>
                    ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <button onClick={() => navigate(-1)}>Back to Patients</button>
      </div>
     
    </>
  );
}

export default BiomedicalView;
