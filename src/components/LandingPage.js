import React from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import './LandingPage.css';

const LandingPage = ({ onVerificationSuccess }) => {
  const handleRecaptchaChange = async (token) => {
    if (token) {
      try {
        const response = await fetch('/api/verify-recaptcha', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token }),
        });

        const data = await response.json();

        if (data.success) {
          onVerificationSuccess();
        } else {
          alert('reCAPTCHA verification failed. Please try again.');
        }
      } catch (error) {
        console.error('Error verifying reCAPTCHA:', error);
      }
    }
  };

  return (
    <div className="landing-page">
      <div className="landing-content">
        <h1>Welcome to HenRi's Technical SEO Analysis</h1>
        <p>Please verify that you are not a robot to continue.</p>
      </div>
      <div className="recaptcha-container">
        <ReCAPTCHA
          sitekey={process.env.REACT_APP_RECAPTCHA_PUBLIC_KEY}
          onChange={handleRecaptchaChange}
        />
      </div>
    </div>
  );
};

export default LandingPage;
