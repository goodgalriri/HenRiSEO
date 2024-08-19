import React, { useState } from 'react';
import './AnalysisSection.css';
import RecommendationSection from './RecommendationSection';

const AnalysisSection = React.forwardRef((props, ref) => {
  const { robotsTxtStatus, sitemapStatus } = props;
  const [isCoreWebVitalsVisible, setIsCoreWebVitalsVisible] = useState(false);

  const toggleCoreWebVitals = () => {
    setIsCoreWebVitalsVisible(!isCoreWebVitalsVisible);
  };

  // Example data for your results - you should replace this with actual data
  const results = {
    LCP: '3.5s',
    INP: '300ms',
    CLS: '0.2s',
  };

  // Generate recommendations based on the results
  const recommendations = [];
  if (parseFloat(results.LCP) > 4) {
    recommendations.push('Improve your Largest Contentful Paint (LCP) by optimizing images, reducing server response time, and removing render-blocking resources.');
  }
  if (parseFloat(results.INP) > 500) {
    recommendations.push('Improve your Interaction to Next Paint (INP) by minimizing main-thread work and optimizing JavaScript.');
  }
  if (parseFloat(results.CLS) > 0.25) {
    recommendations.push('Improve your Cumulative Layout Shift (CLS) by ensuring that images have set dimensions, avoiding ads that push content, and avoiding layout shifts.');
  }

  return (
    <>
      <section ref={ref} className="analysis-section">
        <h2 className="report-summary-title">REPORT SUMMARY</h2>
        
        {/* Display the robots.txt status here */}
        <div className="report-item robots-txt">
          <strong>Robots.txt</strong>
          <p>{robotsTxtStatus || "Robots.txt found / Robots.txt was not found"}</p>
        </div>
        
        {/* Display the XML Sitemap status here */}
        <div className="report-item sitemap">
          <strong>XML Sitemap</strong>
          <p>{sitemapStatus || "Sitemap found / Sitemap was not found"}</p>
        </div>
        
        <div className="report-item">Safe Browsing Site Status (HTTPS)</div>
        <div className="report-item">Mobile Friendly Content</div>
        <div className="report-item" onClick={toggleCoreWebVitals} style={{ cursor: 'pointer' }}>
          Core Web Vitals {isCoreWebVitalsVisible ? '▲' : '▼'}
        </div>

        {isCoreWebVitalsVisible && (
          <div className="core-web-vitals-table">
            <table>
              <thead>
                <tr>
                  <th>Core Web Vitals (Google Search Console):</th>
                  <th>Your Results</th>
                  <th>Good</th>
                  <th>Satisfactory</th>
                  <th>Poor</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>LCP</td>
                  <td>{results.LCP}</td>
                  <td>&lt;=2.5s</td>
                  <td>&lt;=4s</td>
                  <td>&gt;4s</td>
                </tr>
                <tr>
                  <td>INP</td>
                  <td>{results.INP}</td>
                  <td>&lt;=200ms</td>
                  <td>&lt;=500ms</td>
                  <td>&gt;500ms</td>
                </tr>
                <tr>
                  <td>CLS</td>
                  <td>{results.CLS}</td>
                  <td>&lt;=0.1s</td>
                  <td>&lt;=0.25s</td>
                  <td>&gt;0.25s</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Render "OUR RECOMMENDATIONS" title outside the box */}
      <h2 className="recommendation-title">OUR RECOMMENDATIONS</h2>
      <RecommendationSection recommendations={recommendations} />
    </>
  );
});

export default AnalysisSection;


