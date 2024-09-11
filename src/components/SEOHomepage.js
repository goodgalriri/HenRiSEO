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
  const [showMessageBox, setShowMessageBox] = useState(false);

  useEffect(() => {
    console.log('Component has been mounted or updated');
  }, []);

  const handleInputChange = (event) => {
    setUrl(event.target.value);
  };

  const isValidDomain = (url) => {
    if (!/^https?:\/\//i.test(url)) {
      url = `http://${url}`;
    }

    const domainPattern = /^(https?:\/\/)?(www\.)?[a-zA-Z\d-]+(\.[a-zA-Z]{2,})+(\/.*)?$/;
    const bareDomainPattern = /^[a-zA-Z\d-]+(\.[a-zA-Z]{2,})+(\/.*)?$/;
    
    return domainPattern.test(url) || bareDomainPattern.test(url);
  };

  const toggleMessageBox = () => {
    setShowMessageBox((prev) => !prev);
  };

  const handleSubmit = async () => {
    if (!termsAccepted) {
      setErrorMessage('Please accept the Terms and Conditions to proceed.');
      setIsUrlValid(false);
      return;
    }

    if (!isValidDomain(url)) {
      setErrorMessage('Domain format is not correct. Please enter a valid URL.');
      setIsUrlValid(false);
      return;
    }

    setErrorMessage('');
    setIsUrlValid(true);

    try {
      const response = await fetch(`/api/check-robots?url=${encodeURIComponent(url)}`, {
        method: 'GET',
      });

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        setCoreWebVitals({
          LCP: data.coreWebVitals?.LCP || 'Not available',
          INP: data.coreWebVitals?.INP || 'Not available',
          CLS: data.coreWebVitals?.CLS || 'Not available',
        });
        setRobotsTxtStatus(data.robotsTxtStatus);
        setSitemapStatus(data.sitemapStatus);
        setHttpsStatus(data.httpsStatus);
        setMobileFriendlyStatus(data.mobileFriendlyStatus);
      } else {
        throw new Error('Unexpected response format. Expected JSON.');
      }

      fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: 'Henry.Nguyen@itconnexion.com',
          subject: "New URL Submission",
          text: `Dear Analsying Team, at time: ${new Date().toLocaleString()}, a new ran a Technical SEO Analysis test on HenRi with the following URL: ${url}`,
        }),
      }).then(emailResponse => {
        if (!emailResponse.ok) {
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
                  <button
                    onClick={toggleMessageBox}
                    style={{
                      color: 'black',
                      textDecoration: 'underline',
                      background: 'none',
                      border: 'none',
                      padding: 0,
                      cursor: 'pointer',
                      marginLeft: '5px',
                    }}
                  >
                    Terms and Conditions
                  </button>
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

        {/* Terms and Conditions message box displayed above ASK YOURSELF */}
        {showMessageBox && (
          <div className="message-box">
            <h2>Terms and Conditions</h2>
            <div className="terms-content">
              <p>By using the HenRi SEO Analyser service, you agree to the following terms: </p>
              <p>1. Data Collection: We collect certain information, including website URLs, contact details, and usage data, to analyse and improve your SEO performance. </p>
              <p>2. Usage Rights: The data you provide may be used for analysis, internal research, service improvement, and marketing purposes. This includes using anonymised data for product enhancement and sales development. Your personal information will not be sold to third parties. </p>
              <p>3. Consent: By entering your information, you consent to its collection, use, and storage following this policy. </p>
              <p> Disclaimer: HenRi SEO Analyser makes no guarantees about the specific outcomes or benefits of using the service and is not liable for any potential losses arising from the use of our analysis or recommendations.</p>
            </div>
            <button onClick={toggleMessageBox} className="close-button">
              Close
            </button>
          </div>
        )}

        {!isUrlValid && (
          <section className="question-section">
            <div className="ask-yourself-container">
              <p className="ask-yourself">ASK YOURSELF</p>
            </div>
            <div className="question-content">
              <p>Is your organisation’s website reaching its full potential?</p>
              <p>
                Discover the power of cutting-edge SEO analysis to drive more traffic,
                improve your search rankings, and boost your online visibility with
                <span className="highlight"> HenRi</span>.
              </p>
            </div>
          </section>
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
