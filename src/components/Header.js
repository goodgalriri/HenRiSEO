import React from 'react';
import './Header.css'; // Ensure styles are applied

const Header = () => {
  const handleLogoClick = () => {
    window.location.href = '/'; // Redirect to the homepage
  };

  return (
    <header className="seo-header">
      <div className="seo-header-content">
        <div className="seo-header-logo" onClick={handleLogoClick} style={{ cursor: 'pointer' }}>
          <h1 className="seo-header-title">
            <span className="highlight">HenRi</span> SEO Analyser
          </h1>
          <p className="seo-header-tagline">powered by ITConnexion</p>
        </div>
        <nav className="seo-header-nav">
          <a href="#why-seo" className="seo-header-link">
            Why SEO
          </a>
          <a 
            href="https://www.itconnexion.com/contact/" 
            className="seo-header-button" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            Contact our SEO Experts
          </a>
        </nav>
      </div>
    </header>
  );
};

export default Header;

