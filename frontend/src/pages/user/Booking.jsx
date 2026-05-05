import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import '../../styles/user/booking.css';

const Booking = () => {
    const { physioId } = useParams();
    const navigate = useNavigate();

    // Get patient ID from local storage 
    const user = JSON.parse(localStorage.getItem('user')) || {};
    const idpatient = user.idpatient;
    
    // --- Date Helper to prevent Timezone Shifting ---
    const getLocalToday = () => {
        const today = new Date();
        const offset = today.getTimezoneOffset() * 60000;
        return (new Date(today - offset)).toISOString().split('T')[0];
    };

    const [slots, setSlots] = useState([]);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [selectedDate, setSelectedDate] = useState(getLocalToday());
    const [diagnostic, setDiagnostic] = useState('');
    
    // --- New Injury States ---
    const [injuryName, setInjuryName] = useState('');
    const [injuryDate, setInjuryDate] = useState('');
    
    const [loading, setLoading] = useState(false);

const timeLabels = [
    "09:00:00", "09:30:00", 
    "10:00:00", "10:30:00", 
    "11:00:00", "11:30:00", 
    "12:00:00", "12:30:00", 
    "13:00:00", "13:30:00", 
    "14:00:00", "14:30:00", 
    "15:00:00", "15:30:00"
];
    useEffect(() => {
        const fetchAvailability = async () => {
            setLoading(true);
            try {
                const res = await fetch(`http://localhost:5001/api/availability/${physioId}`);
                const data = await res.json();
                setSlots(data);
            } catch (err) {
                console.error("Error fetching availability:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchAvailability();
    }, [physioId]);

    const handleNextStep = () => {
        if (!selectedSlot) return alert("Please select a time slot!");
        if (!injuryName.trim()) return alert("Please provide an injury name.");
      
        navigate('/payment', { 
            state: { 
                idpatient: idpatient, 
                idUser: physioId,
                idAvailability: selectedSlot.idAvailability,
                date: selectedDate,
                time: selectedSlot.start_time,
                diagnostic: diagnostic,
                injuryName: injuryName,
                injuryDate: injuryDate 
            } 
        });
    };
 
    return (
        <div className="booking-page">
           
            <div className="booking-layout">
                <div className="booking-container">
                    <header className="booking-header">
                        <h2>Select Appointment Time</h2>
                        <p>Showing availability for the selected date.</p>
                    </header>

                    <div className="date-selection">
                        <label>Choose Date:</label>
                        <input 
                            type="date" 
                            value={selectedDate} 
                            min={getLocalToday()}
                            onChange={(e) => {
                                setSelectedDate(e.target.value);
                                setSelectedSlot(null); 
                            }} 
                        />
                    </div>

                    {loading ? (
                        <div className="loading-status">Updating available slots...</div>
                    ) : (
                        <div className="time-grid">
                            {timeLabels.map(time => {
                                const slot = slots.find(s => {
                                    const dbDate = new Date(s.available_date).toLocaleDateString('en-CA');
                                    return s.start_time === time && dbDate === selectedDate && s.status !== 'booked';
                                });

                                return (
                                    <button 
                                        key={time} 
                                        className={`time-slot ${slot ? 'available' : 'unavailable'} ${selectedSlot?.idAvailability === slot?.idAvailability ? 'selected' : ''}`}
                                        onClick={() => slot && setSelectedSlot(slot)}
                                        disabled={!slot}
                                    >
                                        {time.substring(0, 5)}
                                        <span className="slot-status">{slot ? 'Available' : 'Taken'}</span>
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>

                <aside className="booking-sidebar">
                    <h3>Booking Summary</h3>
                    <div className="summary-card">
                        {/* --- Injury Record Section --- */}
                        <div className="injury-input-group">
                            <label>What is the injury?</label>
                            <input 
                                type="text"
                                className="sidebar-input"
                                placeholder="e.g. Knee Pain"
                                value={injuryName}
                                onChange={(e) => setInjuryName(e.target.value)}
                            />
                            
                            <label>When did it happen?</label>
                            <input 
                                type="date"
                                className="sidebar-input"
                                max={getLocalToday()}
                                value={injuryDate}
                                onChange={(e) => setInjuryDate(e.target.value)}
                            />
                        </div>

                        <div className="diagnostic-input">
                            <label>Current Symptoms:</label>
                            <textarea 
                                value={diagnostic} 
                                onChange={(e) => setDiagnostic(e.target.value)} 
                                placeholder="Describe how you feel..."
                                rows="3"
                            />
                        </div>

                        <button 
                            className="next-step-btn" 
                            onClick={handleNextStep} 
                            disabled={!selectedSlot || !diagnostic.trim() }
                        >
                            Proceed to Payment
                        </button>
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default Booking;