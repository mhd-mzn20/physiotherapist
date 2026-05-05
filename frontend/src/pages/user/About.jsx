import React from 'react';

import '../../styles/user/about.css';

function About() {
  return (
    <div className="about-page">
     
      
      <main className="about-container">
        <section className="about-header">
          <p className="breadcrumb">About Us</p>
          <h1>PhysioCare Booking: Your Path to Full Recovery</h1>
          <p className="subtitle">Get to know our mission, approach, and the experts behind your care.</p>
        </section>

        <div className="about-grid">
          {/* Left Column */}
          <div className="about-column">
            <div className="about-card">
              <h3>1. Our Story & Vision</h3>
              <p>Founded with a singular vision: to revolutionize physiotherapy by making elite, personalized back pain care accessible and structured.</p>
              <p>Our goal is to provide evidence-backed, comprehensive treatment protocols to provide data-backed, comprehensive treatment protocols to personalized back pain quality.</p>
            </div>

            <div className="about-card">
              <h3>2. The PhysioCare Booking Approach</h3>
              <div className="approach-steps">
                <div className="step">
                  <div className="step-icon">📋</div>
                  <h4>1. Detailed Assessment</h4>
                  <p>Initial consultation, specialized tests</p>
                </div>
                <div className="step">
                  <div className="step-icon">📝</div>
                  <h4>2. Personalized Protocol</h4>
                  <p>Creating Lumbar Series, Stabilization plans</p>
                </div>
                <div className="step">
                  <div className="step-icon">🤝</div>
                  <h4>3. Integrated Therapy</h4>
                  <p>Session and plan history, assigned training</p>
                </div>
              </div>
            </div>

            <div className="about-card">
              <h3>3. Testimonials & Rating Breakdown</h3>
              <p className="stats-highlight"><strong>98% of patients</strong> report improved mobility within 3 months.</p>
              
              <div className="testimonial-box">
                <p>"Dr. Thorne's approach changed my life."</p>
                <div className="stars">★★★★★</div>
              </div>

              <div className="testimonial-box">
                <p>"Dr. Thorne's approach to personalized care."</p>
                <div className="stars">★★★★★</div>
              </div>
              
             
            </div>
          </div>

          {/* Right Column */}
          <div className="about-column">
            <div className="about-card">
              <h3>3. Testimonials & Rating Breakdown</h3>
              <div className="icon-stats-grid">
                <div className="stat-item">👍 98% Mobility</div>
                <div className="stat-item">📄 Protocols</div>
                <div className="stat-item">⭐ Reviews</div>
                <div className="stat-item">🏆 Targets</div>
              </div>
              
              <div className="rating-metrics">
                <div className="metric">
                  <span>Knowledge</span> <div className="bar"><div className="fill" style={{width: '95%'}}></div></div>
                </div>
                <div className="metric">
                  <span>Clarity</span> <div className="bar"><div className="fill" style={{width: '90%'}}></div></div>
                </div>
                <div className="metric">
                  <span>Friendliness</span> <div className="bar"><div className="fill" style={{width: '98%'}}></div></div>
                </div>
              </div>
            </div>

            <div className="about-card">
              <h3>4. Leadership & Expert Team</h3>
              <div className="team-list">
                <div className="team-member">
                  <img src="https://via.placeholder.com/50" alt="Founders" />
                  <div><strong>Founders</strong><br/><span>Founders</span></div>
                </div>
                <div className="team-member">
                  <img src="https://via.placeholder.com/50" alt="Officer" />
                  <div><strong>Head of Clinical</strong><br/><span>Officer</span></div>
                </div>
              </div>
             
            
            </div>
          </div>
        </div>
      </main>
      
    </div>
  );
}

export default About;