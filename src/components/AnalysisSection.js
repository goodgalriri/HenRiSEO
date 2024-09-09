import React, { useState } from 'react';
import './AnalysisSection.css';
import RecommendationSection from './RecommendationSection';

const AnalysisSection = React.forwardRef((props, ref) => {
  const { robotsTxtStatus, sitemapStatus, httpsStatus, mobileFriendlyStatus, coreWebVitals } = props;
  const [isCoreWebVitalsVisible, setIsCoreWebVitalsVisible] = useState(false);

  const toggleCoreWebVitals = () => {
    setIsCoreWebVitalsVisible(!isCoreWebVitalsVisible);
  };

  const categorizeLCP = (value) => {
    if (value <= 2.5) return 'Good';
    if (value <= 4) return 'Satisfactory';
    return 'Poor';
  };

  const categorizeINP = (value) => {
    if (value <= 200) return 'Good';
    if (value <= 500) return 'Satisfactory';
    return 'Poor';
  };

  const categorizeCLS = (value) => {
    if (value === 0) return 'Good';
    if (value <= 0.1) return 'Good';
    if (value <= 0.25) return 'Satisfactory';
    return 'Poor';
  };

  // Parse coreWebVitals values and handle NaN
  const lcpValue = parseFloat(coreWebVitals?.LCP);
  const inpValue = parseFloat(coreWebVitals?.INP);
  const clsValue = parseFloat(coreWebVitals?.CLS);

  // Categories with fallback for NaN
  const lcpCategory = !isNaN(lcpValue) ? categorizeLCP(lcpValue) : 'Not available';
  const inpCategory = !isNaN(inpValue) ? categorizeINP(inpValue) : 'Not available';
  const clsCategory = !isNaN(clsValue) ? categorizeCLS(clsValue) : 'Not available';

  const getChartData = (value, category) => {
    const colorMap = {
      Good: 'green',
      Satisfactory: 'orange',
      Poor: 'red'
    };

    return {
      labels: ['Category'],
      datasets: [{
        data: [100],
        backgroundColor: [colorMap[category] || 'gray'],
        borderWidth: 0
      }]
    };
  };

  const recommendations = [
    "Use alt attributes for images for better SEO.",
    "Ensure your website is mobile-friendly.",
    "Optimize your website's loading speed."
  ];

  return (
    <>
      <section ref={ref} className="analysis-section">
        <h2 className="report-summary-title">REPORT SUMMARY</h2>
        
        <div className="report-item robots-txt">
          <strong>Robots.txt</strong>
          <p>{robotsTxtStatus || "Robots.txt found / Robots.txt was not found"}</p>
        </div>
        
        <div className="report-item sitemap">
          <strong>XML Sitemap</strong>
          <p>{sitemapStatus || "Sitemap found / Sitemap was not found"}</p>
        </div>

        <div className="report-item https-status">
          <strong>HTTPS Status</strong>
          <p>{httpsStatus || "HTTPS status not determined"}</p>
        </div>
        
        <div className="report-item mobile-friendly-status">
          <strong>Mobile Friendly Content</strong>
          <p>{mobileFriendlyStatus || "Mobile friendliness not determined"}</p>
        </div>

        <div className="report-item" onClick={toggleCoreWebVitals} style={{ cursor: 'pointer' }}>
          Core Web Vitals {isCoreWebVitalsVisible ? '▲' : '▼'}
        </div>

        {isCoreWebVitalsVisible && (
          <div className="core-web-vitals-container">
            <h2 className="core-web-vitals-title">Core Web Vitals Analysis</h2>
            <div className="core-web-vitals-row">
              <div className="core-web-vitals-column">
                <div className="core-web-vitals-chart" style={{ background: getChartData(lcpValue, lcpCategory).datasets[0].backgroundColor[0] }}>
                  <span>{isNaN(lcpValue) ? 'Not available' : lcpValue.toFixed(2)}</span>
                </div>
                <h3>LCP</h3>
              </div>
              <div className="core-web-vitals-column">
                <div className="core-web-vitals-chart" style={{ background: getChartData(inpValue, inpCategory).datasets[0].backgroundColor[0] }}>
                  <span>{isNaN(inpValue) ? 'Not available' : inpValue.toFixed(2)}</span>
                </div>
                <h3>INP</h3>
              </div>
              <div className="core-web-vitals-column">
                <div className="core-web-vitals-chart" style={{ background: getChartData(clsValue, clsCategory).datasets[0].backgroundColor[0] }}>
                  <span>{isNaN(clsValue) ? 'Not available' : clsValue.toFixed(2)}</span>
                </div>
                <h3>CLS</h3>
              </div>
            </div>
            <div className="color-legend">
              <div className="good"></div> Good
              <div className="satisfactory"></div> Satisfactory
              <div className="poor"></div> Poor
            </div>
          </div>
        )}
      </section>

      <h2 className="recommendation-title">OUR RECOMMENDATIONS</h2>
      <RecommendationSection recommendations={recommendations} />
    </>
  );
});

export default AnalysisSection;
