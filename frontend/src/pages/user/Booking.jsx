import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import '../../styles/user/booking.css';
import { TextAlignCenter } from 'lucide-react';

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
const [physioData, setPhysioData] = useState(null);

// Services and Pricing
const [services, setServices] = useState([]);
const [selectedService, setSelectedService] = useState(null);
const [totalPrice, setTotalPrice] = useState(0);
//slots reservation
    const [slots, setSlots] = useState([]);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [selectedDate, setSelectedDate] = useState(getLocalToday());
    const [diagnosisName, setDiagnosisName] = useState('');
    const [diagnosisDate, setDiagnosisDate] = useState('');
    const [diagnosisDescription, setDiagnosisDescription] = useState('');
    
    // --- New Injury States ---
    const [injuryName, setInjuryName] = useState('');
    const [injuryDate, setInjuryDate] = useState('');
    const [injuryDetails, setInjuryDetails] = useState('');

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

    useEffect(() => {
    const fetchPhysioDetails = async () => {
        try {
            
            const res = await fetch(`http://localhost:5001/api/users/${physioId}`);
            const data = await res.json();
            setPhysioData(data);
        } catch (err) {
            console.error("Error fetching physio details:", err);
        }
    };

    fetchPhysioDetails();
}, [physioId]);

useEffect(() => {
    const fetchServices = async () => {
        try {
            const res = await fetch(`http://localhost:5001/api/physio-services/${physioId}`);
            const data = await res.json();
            setServices(data);
            // Optional: auto-select the first service
            if (data.length > 0) {
                setSelectedService(data[0]);
                setTotalPrice(data[0].price);
            }
        } catch (err) {
            console.error("Error fetching services:", err);
        }
    };
    fetchServices();
}, [physioId]);


    const handleNextStep = () => {
        if (!selectedSlot) return alert("Please select a time slot!");
        if (!physioData?.fullname) return alert("Loading physiotherapist information, please wait...");
        if (!selectedSlot) return alert("Please select a time slot!");
        if (!selectedService) return alert("Please select a service!");
        navigate('/payment', {
            state: {
                idpatient: idpatient,
                idUser: physioId,
                physioName: physioData.fullname,
                idAvailability: selectedSlot.idAvailability,
                date: selectedDate,
                time: selectedSlot.start_time,
                idService: selectedService.idService,
                serviceName: selectedService.title,
                amount: totalPrice,
                diagnosisName,
                diagnosisDate,
                diagnosisDescription,
                injuryName,
                injuryDate,
                injuryDetails
            }
        });
    };
 
    return (
        <div className="booking-page">
      
        <div className="booking-layout">
            
            <div className="booking-container">
               
                <header className="booking-header">
               <div className="back-btn " onClick={() => navigate(-1)} style={{float:'left'}}>
                &#8592; Back
            </div>  
                   
                    
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
                                        <span className="slot-status">{slot ? 'Available' : 'Unavailable'}</span>
                                    </button>
                                );
                            })}
                        </div>
                    )}
                    <div className="service-selection">
    <h4>Select a Service</h4>
    <div className="service-list">
        {services.map((s) => (
            <label key={s.idService} className={`service-item ${selectedService?.idService === s.idService ? 'active' : ''}`}>
                <input 
                    type="radio" // Use radio so they can only pick one
                    name="service"
                    checked={selectedService?.idService === s.idService}
                    onChange={() => {
                        setSelectedService(s);
                        setTotalPrice(s.price);
                    }}
                />
                <div className="service-info">
                    <span className="service-title">{s.title}</span>
                    <span className="service-price">${s.price}</span>
                </div>
            </label>
        ))}
    </div>
</div>
                </div>


                    
                <aside className="booking-sidebar">
                    <h3>Booking Summary</h3>
                    <div className="summary-card">
                        {/* --- Injury Record Section --- */}
                        <div className="injury-input-group">
    <label>What is the injury?</label>
    <input type="text" className="sidebar-input" value={injuryName} onChange={(e) => setInjuryName(e.target.value)} />
    
    <label>When did it happen?</label>
    <input type="date" className="sidebar-input" value={injuryDate} onChange={(e) => setInjuryDate(e.target.value)} />

    {/* New Field */}
    <label>Injury Details (Optional):</label>
    <textarea className="sidebar-input" value={injuryDetails} onChange={(e) => setInjuryDetails(e.target.value)} rows="2" />
</div>

                        <div className="diagnostic-input">
                            <label>Diagnosis Name:</label>
                            <input
                                type="text"
                                className="sidebar-input"
                                placeholder="e.g. Knee Strain"
                                value={diagnosisName}
                                onChange={(e) => setDiagnosisName(e.target.value)}
                            />
                        </div>
                        <div className="diagnostic-input">
                            <label>Date of Diagnosis:</label>
                            <input
                                type="date"
                                className="sidebar-input"
                                max={getLocalToday()}
                                value={diagnosisDate}
                                onChange={(e) => setDiagnosisDate(e.target.value)}
                            />
                        </div>
                        <div className="diagnostic-input">
                            <label>Description:</label>
                            <textarea
                                value={diagnosisDescription}
                                onChange={(e) => setDiagnosisDescription(e.target.value)}
                                placeholder="Describe the diagnosis..."
                                rows="3"
                            />
                        </div>

                        <button 
                            className="next-step-btn" 
                            onClick={handleNextStep} 
                            disabled={!selectedSlot }
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