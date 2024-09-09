import React, { useState, useEffect } from 'react';
import AnalysisSection from './AnalysisSection';
import Header from './Header';
import './SEOHomepage.css';

const SEOHomepage = () => {
  const [url, setUrl] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isUrlValid, setIsUrlValid] = useState(false);
  const [robotsTxtStatus, setRobotsTxtStatus] = useState('');
  const [sitemapStatus, setSitemapStatus] = useState('');
  const [httpsStatus, setHttpsStatus] = useState('');
  const [mobileFriendlyStatus, setMobileFriendlyStatus] = useState('');
  const [coreWebVitals, setCoreWebVitals] = useState({
    LCP: 'Not available',
    INP: 'Not available',
    CLS: 'Not available',
  });
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showMessageBox, setShowMessageBox] = useState(false); // For message box visibility

  useEffect(() => {
    // Log when the component mounts or updates
    console.log('Component has been mounted or updated');
  }, []);

  const handleInputChange = (event) => {
    setUrl(event.target.value);
  };

  const isValidDomain = (url) => {
    // Check if the URL starts with http:// or https://, otherwise prepend http://
    if (!/^https?:\/\//i.test(url)) {
      url = `http://${url}`;
    }
  
    // Regular expression for validating domain names with optional protocol and www
    const domainPattern = /^(https?:\/\/)?(www\.)?[a-zA-Z\d-]+(\.[a-zA-Z]{2,})+(\/.*)?$/;
    const bareDomainPattern = /^[a-zA-Z\d-]+(\.[a-zA-Z]{2,})+(\/.*)?$/;
    
    // Check if the URL matches the domain patterns
    const isDomainValid = domainPattern.test(url) || bareDomainPattern.test(url);
    return isDomainValid;
  const toggleMessageBox = () => {
    setShowMessageBox((prev) => !prev); // Toggle message box visibility
  };

  const isValidDomain = (domain) => {
    const domainPattern = /^https?:\/\/(www\.)?[a-zA-Z\d-]+(\.[a-zA-Z]{2,})+\/?$/;
    return domainPattern.test(domain);
  };
  
  const handleSubmit = async () => {
    // Validate URL format before making the request
    // Check if the "Terms and Conditions" checkbox is checked
    if (!termsAccepted) {
      setErrorMessage('Please accept the Terms and Conditions to proceed.');
      setIsUrlValid(false);
      return;
    }

    // Validate the domain format
    if (!isValidDomain(url)) {
      setErrorMessage('Domain format is not correct. Please enter a valid URL.');
      setIsUrlValid(false);
      return;
    }

    setErrorMessage('');
    setIsUrlValid(true);

    try {
      // 1. Perform the analysis by making a GET request to /api/check-robots
      const response = await fetch(`/api/check-robots?url=${encodeURIComponent(url)}`, {
        method: 'GET',
      });

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();

        // Set core web vitals with default values if they are not available
        setCoreWebVitals({
          LCP: data.coreWebVitals?.LCP || 'Not available',
          INP: data.coreWebVitals?.INP || 'Not available',
          CLS: data.coreWebVitals?.CLS || 'Not available',
        });

        // Set status messages based on the API response
        setRobotsTxtStatus(data.robotsTxtStatus);
        setSitemapStatus(data.sitemapStatus);
        setHttpsStatus(data.httpsStatus);
        setMobileFriendlyStatus(data.mobileFriendlyStatus);
      } else {
        throw new Error('Unexpected response format. Expected JSON.');
      }

      // 2. Send an email after the analysis is done
      console.log("Sending request to /api/send-email with URL:", url);
      fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            to: 'Henry.Nguyen@itconnexion.com', // Email recipient
            subject: "New URL Submission", // Email subject
            text: `Dear developer, at time: ${new Date().toLocaleString()}, a user submitted the following URL: ${url}`, // Email body text
        }),
      }).then(emailResponse => {
        if (!emailResponse.ok) {
          // Log detailed error message if the request fails
          return emailResponse.json().then(data => {
            setErrorMessage('Failed to send email: ' + data.message);
            console.warn('Failed to send email:', data.message);
          });
        } else {
          console.log('Email sent successfully');
        }
      }).catch(err => {
        setErrorMessage('Error sending email. Please try again.');
        console.error('Error sending email:', err);
      });

    } catch (error) {
      // Handle any errors that occur during the fetch request
      setErrorMessage(error.message || 'Failed to check the URL. Please try again.');
      setIsUrlValid(false);
    }
  };

  return (
    <div className="homepage">
      <Header />
      <main className="main-content">
        <section className="welcome-section">
          <h1 className="welcome-title">Welcome.</h1>
          <h2 className="subtitle">
            Unlock Your Website's Potential with{' '}
            <span className="highlight">HenRi's Technical SEO Analysis</span>
          </h2>
          <div className="input-container">
            <input
              type="text"
              placeholder="Insert your URL here"
              value={url}
              onChange={handleInputChange}
              className={`url-input ${errorMessage ? 'input-error' : ''}`}
            />

            {/* Conditionally hide Terms and Conditions when the report is shown */}
            {!isUrlValid && (
              <div className="terms-conditions">
                <input
                  type="checkbox"
                  id="terms"
                  name="terms"
                  onChange={(e) => {
                    setTermsAccepted(e.target.checked);
                  }}
                />
                <label htmlFor="terms" style={{ color: 'black', fontSize: '16px' }}>
                  I agree to the
                  <a
                    href="#"
                    onClick={toggleMessageBox}
                    style={{ color: 'black', textDecoration: 'underline', marginLeft: '5px' }}
                  >
                    Terms and Conditions
                  </a>
                  &nbsp;and understand that data may be collected for analysis purposes.
                </label>
              </div>
            )}

            <button onClick={handleSubmit} className="analyze-button" disabled={!termsAccepted}>
              Analyse your Website
            </button>
          </div>

          {errorMessage && <div className="warning-box">{errorMessage}</div>}
        </section>

        {!isUrlValid && (
          <section className="question-section">
            <div className="ask-yourself-container">
              <p className="ask-yourself">ASK YOURSELF</p>
        {/* Conditionally hide the Terms and Conditions message box */}
        {!isUrlValid && showMessageBox && (
          <div className="message-box">
            <h2>Terms and Conditions</h2>
            <div className="terms-content">
              <p>By using this technical anlysis service, you agree to the following terms:</p>
              <p>1. Data Collection: We collect certain information for the purpose of analysing improving your SEO.</p>
              <p>2. Usage Rights: The data you provide can be used for analysis purposes as well as collecting for training and sales.</p>
            </div>
            <button onClick={toggleMessageBox} className="close-button">
              Close
            </button>
          </div>
        )}

        {isUrlValid && (
          <AnalysisSection
            robotsTxtStatus={robotsTxtStatus}
            sitemapStatus={sitemapStatus}
            httpsStatus={httpsStatus}
            mobileFriendlyStatus={mobileFriendlyStatus}
            coreWebVitals={coreWebVitals}
          />
        )}
      </main>
    </div>
  );
};

export default SEOHomepage;