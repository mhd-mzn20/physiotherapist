import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';



function CreateCollaboration() {
  const navigate = useNavigate();
  const [engineers, setEngineers] = useState([]);
  const [physiotherapists, setPhysiotherapists] = useState([]);
  const [collaborations, setCollaborations] = useState({}); // { physioId: [engineerNames] }

  const [selectedEngineer, setSelectedEngineer] = useState("");
  const [selectedPhysios, setSelectedPhysios] = useState([]);
  const [search, setSearch] = useState("");

  /* ================= LOAD ENGINEERS & PHYSIOS ================= */
  useEffect(() => {
    fetchEngineers();
    fetchPhysios();
  }, []);

  const fetchEngineers = async () => {
    try {
      const res = await fetch(
        "http://localhost:5001/api/users/role/biomedical_engineer"
      );
      const data = await res.json();
      setEngineers(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchPhysios = async () => {
    try {
      const res = await fetch(
        "http://localhost:5001/api/users/role/physiotherapist"
      );
      const data = await res.json();
      setPhysiotherapists(data);
      fetchCollaborations();
    } catch (err) {
      console.error(err);
    }
  };

  /* ================= LOAD ALL COLLABORATIONS ================= */
  const fetchCollaborations = async () => {
    try {
      const res = await fetch("http://localhost:5001/api/collaborations");
      const data = await res.json(); 
      // data = [{idphysiotherapist, idbiomedicalengineer, engName}]
      const collabMap = {};
      data.forEach((row) => {
        if (!collabMap[row.idphysiotherapist]) collabMap[row.idphysiotherapist] = [];
        collabMap[row.idphysiotherapist].push(row.engName);
      });
      setCollaborations(collabMap);
    } catch (err) {
      console.error(err);
    }
  };

  /* ================= LOAD SELECTED ENGINEER'S PHYSIOS ================= */
  const loadEngineerCollaborations = async (engineerId) => {
    if (!engineerId) {
      setSelectedPhysios([]);
      return;
    }
    try {
      const res = await fetch(
        `http://localhost:5001/api/collaborations/engineer/${engineerId}`
      );
      const data = await res.json(); // [{idphysiotherapist}]
      const physioIds = data.map((p) => Number(p.idphysiotherapist));
      setSelectedPhysios(physioIds);
    } catch (err) {
      console.error(err);
    }
  };

  const handleEngineerChange = (e) => {
    const engineerId = Number(e.target.value);
    setSelectedEngineer(engineerId);
    loadEngineerCollaborations(engineerId);
  };

  /* ================= TOGGLE PHYSIO ================= */
  const togglePhysio = (id) => {
    const numId = Number(id);
    setSelectedPhysios((prev) =>
      prev.includes(numId)
        ? prev.filter((p) => p !== numId)
        : [...prev, numId]
    );
  };

  /* ================= SAVE COLLABORATIONS ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedEngineer) return;

    try {
      const res = await fetch(`http://localhost:5001/api/collaborations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idBiomedical: selectedEngineer,
          idPhysios: selectedPhysios,
        }),
      });
      const data = await res.json();
      console.log("Saved:", data);

      // Refresh all cards
      fetchCollaborations();
      // Refresh selected engineer physiotherapists
      loadEngineerCollaborations(selectedEngineer);
    } catch (err) {
      console.error(err);
    }
  };

  /* ================= FILTER PHYSIOS ================= */
  const filteredPhysios = physiotherapists.filter((p) =>
    p.fullname.toLowerCase().includes(search.toLowerCase())
  );

  return (
<>
      

    <div className="container page-therapy">
      <button onClick={() => navigate('/portal')} className="back-btn2">←Back to Portal</button>   
      <h2>Create Collaboration</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Biomedical Engineer</label>
          <br />
          <select value={selectedEngineer} onChange={handleEngineerChange}>
            <option value="">Select Engineer</option>
            {engineers.map((eng) => (
              <option key={eng.idUser} value={eng.idUser}>
                {eng.fullname}
              </option>
            ))}
          </select>
        </div>

        <br />

        <div>
          <label>Search Physiotherapist</label>
          <br />
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <br />

        <div>
          <h3>Physiotherapists</h3>
          {filteredPhysios.length === 0 && <p>No physiotherapists found.</p>}

          {filteredPhysios.map((physio) => {
            const isSelected = selectedPhysios.includes(Number(physio.idUser));
            return (
              <div
                key={physio.idUser}
                onClick={() => togglePhysio(physio.idUser)}
                style={{
                  padding: "10px",
                  margin: "5px 0",
                  border: "1px solid #ccc",
                  cursor: "pointer",
                  backgroundColor: isSelected ? "#cce5ff" : "#f9f9f9",
                }}
              >
                {physio.fullname} {isSelected && "✓"}
              </div>
            );
          })}
        </div>

        <br />

        <button type="submit">Save Collaboration</button>
      </form>

      <hr />

      <h2>Previous Collaborations</h2>
      {physiotherapists.map((physio) => (
        <div
          key={physio.idUser}
          style={{
            border: "1px solid #ccc",
            padding: "10px",
            margin: "5px 0",
          }}
        >
          <strong>{physio.fullname}</strong> -{" "}
          {collaborations[physio.idUser]?.length || 0} Engineer(s)
          <div style={{ marginTop: "5px" }}>
            {(collaborations[physio.idUser] || []).map((eng, i) => (
              <span
                key={i}
                style={{
                  padding: "2px 5px",
                  margin: "0 3px",
                  backgroundColor: "#007bff",
                  color: "#fff",
                  borderRadius: "3px",
                  fontSize: "12px",
                }}
              >
                {eng}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>

    </>

  );
}

export default CreateCollaboration;
