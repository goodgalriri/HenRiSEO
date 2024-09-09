import React, { useState } from 'react';
import LandingPage from './components/LandingPage';
import SEOHomepage from './components/SEOHomepage';


const App = () => {
  const [isVerified, setIsVerified] = useState(false);

  const handleVerificationSuccess = () => {
    setIsVerified(true);
  };

  return (
    <div className="app">
      {isVerified ? (
        <SEOHomepage />
      ) : (
        <LandingPage onVerificationSuccess={handleVerificationSuccess} />
      )}
    </div>
  );
};

export default App;





