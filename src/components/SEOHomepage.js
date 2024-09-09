import React, { useRef, useState } from 'react';
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
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showMessageBox, setShowMessageBox] = useState(false); // For message box visibility

  const analysisSectionRef = useRef(null);

  const handleInputChange = (event) => {
    setUrl(event.target.value);
  };

  const toggleMessageBox = () => {
    setShowMessageBox((prev) => !prev); // Toggle message box visibility
  };

  const isValidDomain = (domain) => {
    const domainPattern = /^https?:\/\/(www\.)?[a-zA-Z\d-]+(\.[a-zA-Z]{2,})+\/?$/;
    return domainPattern.test(domain);
  };

  const handleSubmit = async () => {
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

    setErrorMessage(''); // Clear any previous error message
    setIsUrlValid(true); // Indicate the URL is valid

    try {
      const response = await fetch(`/api/check-robots?url=${encodeURIComponent(url)}`, {
        method: 'GET',
      });

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        if (response.status === 400) {
          throw new Error(data.message);
        }
        setRobotsTxtStatus(data.robotsTxtStatus); // Store robots.txt message
        setSitemapStatus(data.sitemapStatus); // Store sitemap message
        setHttpsStatus(data.httpsStatus); // Store HTTPS message
        setMobileFriendlyStatus(data.mobileFriendlyStatus); // Store mobile-friendly message
      } else {
        throw new Error('Unexpected response format. Expected JSON.');
      }
    } catch (error) {
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

        {/* Conditionally render AnalysisSection based on URL validity */}
        {isUrlValid && (
          <>
            <AnalysisSection
              ref={analysisSectionRef}
              robotsTxtStatus={robotsTxtStatus}
              sitemapStatus={sitemapStatus}
              httpsStatus={httpsStatus}
              mobileFriendlyStatus={mobileFriendlyStatus}
            />
          </>
        )}
      </main>
    </div>
  );
};

export default SEOHomepage;