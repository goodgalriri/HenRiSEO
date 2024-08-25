const express = require('express');
const axios = require('axios');
const http = require('http');
const { JSDOM } = require('jsdom');

const app = express();
const port = 3001;

// Increase the max header size limit
const server = http.createServer(app);
server.maxHeaderSize = 32 * 1024; // 32KB, just to try a higher value

// Increase the limit for request headers
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Headers', '*');
  next();
});

// Middleware to parse JSON bodies with increased limits
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// API route to check for robots.txt, sitemap, HTTPS, and mobile-friendliness
app.get('/api/check-robots', async (req, res) => {
    const { url } = req.query;

    if (!url) {
        console.error('No URL provided');
        return res.status(400).json({ message: 'No URL provided' });
    }

    let robotsTxtStatus = '';
    let sitemapStatus = '';
    let httpsStatus = '';
    let mobileFriendlyStatus = '';

    try {
        // 1. Check URL reachability
        await axios.get(url).catch((error) => {
            throw new Error('Invalid URL');
        });

        // 2. Checking for robots.txt
        const robotsTxtUrl = new URL('/robots.txt', url);
        const response = await axios.get(robotsTxtUrl.href);

        if (response.status === 200) {
            robotsTxtStatus = 'Robots.txt was found on your site';

            // 3. Checking for sitemap.xml inside robots.txt
            const robotsTxtContent = response.data;
            const sitemapRegex = /Sitemap:\s*(\S+)/i;
            const sitemapMatch = robotsTxtContent.match(sitemapRegex);

            if (sitemapMatch) {
                sitemapStatus = `Sitemap found: ${sitemapMatch[1]}`;
            } else {
                sitemapStatus = 'Sitemap was not found in robots.txt.';
            }
        } else if (response.status === 404) {
            robotsTxtStatus = 'Robots.txt was not found on your site';
            sitemapStatus = 'Sitemap was not found.';
        } else {
            return res.status(response.status).json({ message: `Failed to check robots.txt with status code ${response.status}.` });
        }

        // 3. Check if HTTPS is used
        if (url.startsWith('https://')) {
            httpsStatus = 'HTTPS is enabled on your site.';
        } else {
            httpsStatus = 'HTTPS is not enabled on your site.';
        }

        // 4. Check for mobile-friendliness by looking for viewport meta tag and responsive elements
        const pageResponse = await axios.get(url);
        const dom = new JSDOM(pageResponse.data);
        const document = dom.window.document;

        const viewportMeta = document.querySelector('meta[name="viewport"]');
        const mobileFriendlyElements = document.querySelectorAll('[class*="col-"], img, [style*="width: 100%"]');
        const mediaQueries = Array.from(document.styleSheets).some((sheet) => {
            try {
                return Array.from(sheet.cssRules || []).some(rule => 
                    rule.media && rule.media.mediaText.includes('max-width')
                );
            } catch (err) {
                return false; // Handle cross-origin restrictions for CSS rules
            }
        });

        if (viewportMeta || mediaQueries || mobileFriendlyElements.length > 0) {
            mobileFriendlyStatus = 'The site is mobile-friendly.';
        } else {
            mobileFriendlyStatus = 'The site is not mobile-friendly.';
        }

    } catch (error) {
        console.error('Error:', error.message);
        return res.status(400).json({ message: 'Invalid URL' });
    }

    // Send the response with all statuses
    return res.json({ robotsTxtStatus, sitemapStatus, httpsStatus, mobileFriendlyStatus });
});

// Start the server
server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
