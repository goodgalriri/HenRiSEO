import React, { useRef, useState } from 'react';
import AnalysisSection from './AnalysisSection'; // Import the AnalysisSection component
import Header from './Header';
import './SEOHomepage.css';

const SEOHomepage = () => {
  const [url, setUrl] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isUrlValid, setIsUrlValid] = useState(false);
  const [robotsTxtStatus, setRobotsTxtStatus] = useState('');
  const [sitemapStatus, setSitemapStatus] = useState('');

  const analysisSectionRef = useRef(null);

  const handleInputChange = (event) => {
    setUrl(event.target.value);
  };

  const isValidDomain = (domain) => {
    const domainPattern = /^https?:\/\/(www\.)?[a-zA-Z\d-]+(\.[a-zA-Z]{2,})+\/?$/;
    return domainPattern.test(domain);
  };

  const handleSubmit = async () => {
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
        setRobotsTxtStatus(data.robotsTxtStatus); // Store robots.txt message
        setSitemapStatus(data.sitemapStatus); // Store sitemap message
      } else {
        throw new Error('Unexpected response format. Expected JSON.');
      }
    } catch (error) {
      setErrorMessage('Failed to check the URL. Please try again.');
      setIsUrlValid(false);
    }
  };

  return (
    <div className="homepage">
      <Header />
      <main className="main-content">
        <section className="welcome-section">
          <h1 className="welcome-title">Welcome</h1>
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
            <button onClick={handleSubmit} className="analyze-button">
              Analyze your Website
            </button>
          </div>
          {errorMessage && <div className="warning-box">{errorMessage}</div>}
        </section>

        {/* Conditionally render "Ask Yourself" section */}
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

        {/* Conditionally render AnalysisSection based on URL validity */}
        {isUrlValid && (
          <>
            <AnalysisSection
              ref={analysisSectionRef}
              robotsTxtStatus={robotsTxtStatus}
              sitemapStatus={sitemapStatus}
            />
          </>
        )}
      </main>
    </div>
  );
};

export default SEOHomepage;

