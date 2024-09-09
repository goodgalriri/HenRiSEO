import React from 'react';
import './RecommendationSection.css';

const RecommendationSection = () => {
  return (
    <section className="recommendations-section">
      <div className="recommendations-content">
        <ul>
              <strong>Robots.txt</strong>
              <p>A Robots.txt file instructs search engine robots which pages on the website to crawl and index for a faster discovery. Make sure you add a Robots.txt file to improve your search ranking.</p>
            <br></br>
              <strong>XML Sitemap</strong>
              <p>XML sitemaps instruct search engines about your website structure. Add an optimized XML sitemap to your website to improve your ranking.</p>
              <p>Don’t know how? <a href="https://www.itconnexion.com/contact/" target="_blank" rel="noopener noreferrer">Contact our SEO team</a> at ITConnexion for more info!</p>
            <br></br>
              <strong>Safe Browsing Site Status (HTTPS)</strong>
              <p>Swapping to an HTTPS protocol can help with ranking. Consider adding an SSL or TLS security certificate to enhance web performance.</p>
            <br></br>
              <strong>Mobile Friendly Content</strong>
              <p>Ensure that all pages employ a responsive design to adapt to different screen sizes. Optimize image sizes and quality to enhance page loading speeds. Improve menus, breadcrumbs, internal links, and contact buttons to enhance overall site navigation.</p>
            <br></br>
              <strong>Core Web Vitals (Google Search Console)</strong>
              <p>Several tools can help you improve your site speed and Core Web Vitals, with Google PageSpeed Insights being the top choice. To enhance website speed, consider the following optimizations:</p>
              <ul>
                <li>Implement lazy-loading for non-critical images</li>
                <li>Optimize image formats for browsers</li>
                <li>Improve JavaScript performance</li>
              </ul>
        </ul>
      </div>

      {/* New section for call-to-action */}
      <div className="cta-section">
        <p>These technical SEO aspects, paired with aligned content, can help your website rank higher in the search world. Want to climb up the ranks?</p>
        <a href="https://www.itconnexion.com/contact/" target="_blank" rel="noopener noreferrer" className="contact-link">
        Contact our SEO Expert Team
        </a> at ITConnexion for more!
      </div>
    </section>
  );
};

export default RecommendationSection;




