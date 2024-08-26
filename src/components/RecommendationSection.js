import React from 'react';
import './RecommendationSection.css';

const RecommendationSection = ({ recommendations }) => {
  return (
    <section className="recommendations-section">
      <div className="recommendations-content">
        {recommendations.length > 0 ? (
          <ul>
            {recommendations.map((rec, index) => (
              <li key={index}>{rec}</li>
            ))}
          </ul>
        ) : (
          <p>Your site is performing well according to the Core Web Vitals metrics.</p>
        )}
      </div>
    </section>
  );
};

export default RecommendationSection;
