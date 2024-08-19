import React, { useState, useRef } from 'react';
import Header from './Header';
import AnalysisSection from './AnalysisSection'; // Import the AnalysisSection component
import './SEOHomepage.css';

const SEOHomepage = () => {
  const [url, setUrl] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isUrlValid, setIsUrlValid] = useState(false); // State to track if the URL is valid
  const [robotsTxtStatus, setRobotsTxtStatus] = useState(''); // State to store robots.txt status
  const analysisSectionRef = useRef(null);

  const handleInputChange = (event) => {
    setUrl(event.target.value);
    setErrorMessage(''); // Clear the error message when the user starts typing
    setIsUrlValid(false); // Reset the URL validity when the user starts typing
    setRobotsTxtStatus(''); // Reset robots.txt status when the user starts typing
  };

  const isValidDomain = (domain) => {
    // This pattern matches domains that may start with http://, https://, www., and a valid domain name
    const domainPattern = /^(https?:\/\/)?(www\.)?itconnexion\.com$/;
    return domainPattern.test(domain);
  };
  
  const handleSubmit = async () => {
    console.log('Input URL:', url);
    
    if (!isValidDomain(url)) {
      setErrorMessage('Domain format is not correct. Please enter a valid URL.');
      setIsUrlValid(false);
      return;
    }
    
    console.log('URL validation passed.');
    setErrorMessage(''); // Clear any previous error message
    setIsUrlValid(true); // Indicate the URL is valid
    
    // Ensure the URL has the correct format
    const formattedUrl = url.startsWith('http') ? url : `https://${url}`;
    
    // Check for robots.txt only if the domain format is correct
    try {
      const response = await fetch(`/api/check-robots?url=${encodeURIComponent(formattedUrl)}`);
      const data = await response.json();
      setRobotsTxtStatus(data.message);
    } catch (error) {
      setErrorMessage('Failed to check the robots.txt file. Please try again.');
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
            <button onClick={handleSubmit} className="analyze-button">
              Analyse your Website
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
            <p className="status-message">{robotsTxtStatus}</p>
            <AnalysisSection ref={analysisSectionRef} robotsTxtStatus={robotsTxtStatus} />
          </>
        )}
      </main>
    </div>
  );
};

export default SEOHomepage;








