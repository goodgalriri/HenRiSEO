import React from 'react';
import ReCAPTCHA from 'react-google-recaptcha';

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
          onVerificationSuccess(); // Trigger the callback function after successful captcha
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
      <h1>Welcome to HenRi's Technical SEO Analysis</h1>
      <p>Please verify that you are not a robot to continue.</p>
      <ReCAPTCHA
        sitekey="6LdEpTIqAAAAAKZZ99-USSer6q8o8sDYEl91tgPV"
        onChange={handleRecaptchaChange}
      />
    </div>
  );
};

export default LandingPage;