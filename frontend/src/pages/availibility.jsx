import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../styles/availability.css';


const Availability = () => {
    const navigate = useNavigate();
    
    // Get idUser from route params, fall back to sessionStorage
    const { idUser: paramId } = useParams();
    const idUser = paramId || sessionStorage.getItem('idUser');
    
    const getLocalToday = () => {
    const today = new Date();
    const offset = today.getTimezoneOffset() * 60000; // offset in milliseconds
    const localISOTime = (new Date(today - offset)).toISOString().split('T')[0];
    return localISOTime;
};
    const [dbSlots, setDbSlots] = useState([]); // Truth from Database
    const [selectedDate, setSelectedDate] = useState(getLocalToday());
    const [pendingChanges, setPendingChanges] = useState([]); // Temporary clicks
    const [loading, setLoading] = useState(true);

    // Exact HH:MM:SS format to match your SQL TIME column
  const timeLabels = [
    "09:00:00", "09:30:00", 
    "10:00:00", "10:30:00", 
    "11:00:00", "11:30:00", 
    "12:00:00", "12:30:00", 
    "13:00:00", "13:30:00", 
    "14:00:00", "14:30:00", 
    "15:00:00" ,"15:30:00"
];
    useEffect(() => {
        // 1. Role-Based Access Control
        
        loadData();
    }, [idUser, selectedDate, navigate]);

    // Fetch current availability from DB
    const loadData = () => {
        setLoading(true);
        fetch(`http://localhost:5001/api/availability/${idUser}`)
            .then(res => res.json())
            .then(data => {
                setDbSlots(data);
                setPendingChanges([]); // Reset pending on refresh/date change
                setLoading(false);
            })
            .catch(err => {
                console.error("Fetch error:", err);
                setLoading(false);
            });
    };

    const handleCellClick = (time) => {
        if (pendingChanges.includes(time)) {
            setPendingChanges(pendingChanges.filter(t => t !== time));
        } else {
            setPendingChanges([...pendingChanges, time]);
        }
    };

    const confirmChanges = async () => {
        if (pendingChanges.length === 0) return;

        try {
            await Promise.all(pendingChanges.map(time => 
                fetch('http://localhost:5001/api/availability/toggle', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        idUser,
                        available_date: selectedDate,
                        start_time: time
                    })
                })
            ));
            alert("Schedule successfully updated!");
            loadData(); // Re-sync state with the database
        } catch (error) {
            alert("An error occurred while saving changes.");
        }
    };

    return (
        <div className="manage-page">
           
            <main className="manage-container">
                <header className="manage-header">
                    <h1>Manage Your Availability</h1>
                    <p>Select a date and click time slots to toggle your working hours.</p>
                </header>

                <section className="controls">
                    <div className="date-picker-group">
                        <label>Target Date:</label>
                        <input 
                            type="date" 
                            value={selectedDate} 
                            min={getLocalToday()}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="date-input"
                        />
                    </div>
                </section>

                {loading ? (
                    <div className="loader">Updating Schedule...</div>
                ) : (
                    <div className="management-grid">
                        {timeLabels.map(time => {
                            // Check if slot exists in DB for current date
                            const isAvailableInDB = dbSlots.some(s => {
                            // 1. Convert the DB date to a clean YYYY-MM-DD string without timezone shifting
                            const dbDate = new Date(s.available_date);
                            const formattedDbDate = dbDate.toLocaleDateString('en-CA'); // Outputs YYYY-MM-DD exactly

    return s.start_time === time && formattedDbDate === selectedDate;
});
                            const isClicked = pendingChanges.includes(time);

                            // Determine visual state
                            let slotClass = isAvailableInDB ? "online" : "offline";
                            if (isClicked) slotClass = "pending";

                            return (
                                <div 
                                    key={time} 
                                    className={`manage-slot ${slotClass}`}
                                    onClick={() => handleCellClick(time)}
                                >
                                    <span className="time-display">{time.substring(0, 5)}</span>
                                    <span className="status-indicator">
                                        {isAvailableInDB && !isClicked && "✅ Available"}
                                        {!isAvailableInDB && !isClicked && "❌ Not Set"}
                                        {isAvailableInDB && isClicked && "⚠️ Will Delete"}
                                        {!isAvailableInDB && isClicked && "➕ Will Add"}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                )}

                <footer className="manage-footer">
                    <button 
                        className="btn-save" 
                        onClick={confirmChanges}
                        disabled={pendingChanges.length === 0}
                    >
                        Confirm and Save {pendingChanges.length > 0 && `(${pendingChanges.length})`}
                    </button>
                </footer>
            </main>
          
        </div>
    );
};

export default Availability;