import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../../styles/user/payment.css';

const Payment = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const [method, setMethod] = useState('online');

    // If a user refreshes or navigates here directly without booking data
    if (!state) {
        return (
            <div className="payment-page">
                <div className="error-card">
                    <p>No booking session found. Please start over.</p>
                    <button onClick={() => navigate('/find-physio')}>Go Back</button>
                </div>
            </div>
        );
    }

    const handleFinalConfirm = async () => {
        const idPatient = localStorage.getItem('idpatient') || sessionStorage.getItem('idpatient');


        const payload = {
            idpatient: idPatient,
            idUser: state.idUser,
            idAvailability: state.idAvailability,
            idService: state.idService, // Ensure your backend accepts this now
            amount: state.amount,       // Use the dynamic amount
            payment_method: method,
            diagnostics: state.diagnostics || [],
            injuries: state.injuries || []
        };

        try {
            const res = await fetch('http://localhost:5001/api/confirm-booking-payment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                alert("Booking successful!");
                navigate('/home');
            } else {
                const errorData = await res.json();
                alert(`Error: ${errorData.message || "Booking failed"}`);
            }
        } catch (err) {
            console.error("Payment Error:", err);
        }
    };

    return (
        <>
       
      
        <div className="payment-page">
          
            <div className="payment-container">
                
                {/* Inside the summary-info section of Payment.jsx */}
                <div className="summary-info">
                     <div className="back-btn " onClick={() => navigate(-1)} >
                &#8592; Back
            </div> 
                    <h2>Confirm & Pay</h2>

                    <div className="summary-item">
                        <strong>Specialist</strong>
                        {/* Changed from ID to Name */}
                        <p>Dr. {state.physioName}</p>
                    </div>

                    <div className="summary-item">
                        <strong>Appointment Date</strong>
                        <p>{new Date(state.date).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}</p>
                    </div>

                    <div className="summary-item">
                        <strong>Time Slot</strong>
                        <p>{state.time.substring(0, 5)}</p>
                    </div>

                    <div className="summary-item">
                        <strong>Service</strong>
                        <p>{state.serviceName}</p>
                    </div>

                    {(state.injuries && state.injuries.some(i => i.injuryName)) && (
                        <div className="summary-item">
                            <strong>Injuries</strong>
                            <div style={{fontSize: '0.9em', color: '#555'}}>
                                {state.injuries.filter(i => i.injuryName).map((i, idx) => (
                                    <p key={idx} style={{margin: '4px 0'}}>- {i.injuryName} ({i.injuryDate})</p>
                                ))}
                            </div>
                        </div>
                    )}

                    {(state.diagnostics && state.diagnostics.some(d => d.diagnosisName)) && (
                        <div className="summary-item">
                            <strong>Diagnostics</strong>
                            <div style={{fontSize: '0.9em', color: '#555'}}>
                                {state.diagnostics.filter(d => d.diagnosisName).map((d, idx) => (
                                    <p key={idx} style={{margin: '4px 0'}}>- {d.diagnosisName} ({d.diagnosisDate})</p>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="total-cost-box">
                        <span>Total Amount: ${state.amount}</span>

                    </div>
                </div>

                {/* Right Column: Payment & Confirm */}
                <div className="payment-section">
                    <h3>Select Payment Method</h3>

                    <div className="payment-options">
                        <label className={`method-card ${method === 'online' ? 'active' : ''}`}>
                            <input
                                type="radio"
                                name="payment"
                                onChange={() => setMethod('online')}
                                checked={method === 'online'}
                            />
                            <div className="method-text">
                                <strong>Pay Online Now</strong>
                                <span>Secure Credit/Debit Card payment</span>
                            </div>
                        </label>

                        <label className={`method-card ${method === 'in-clinic' ? 'active' : ''}`}>
                            <input
                                type="radio"
                                name="payment"
                                onChange={() => setMethod('in-clinic')}
                                checked={method === 'in-clinic'}
                            />
                            <div className="method-text">
                                <strong>Pay in Clinic</strong>
                                <span>Pay at the front desk after the session</span>
                            </div>
                        </label>
                    </div>

                    <button onClick={handleFinalConfirm} className="pay-btn">
                        Confirm Booking
                    </button>

                    <p className="terms-text">
                        By confirming, you agree to our booking terms and conditions.
                    </p>
                </div>

            </div>
        </div>
        </>
    );
};

export default Payment;