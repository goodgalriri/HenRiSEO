const express = require('express');
const axios = require('axios');
const http = require('http');

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

// API route to check for robots.txt and sitemap
app.get('/api/check-robots', async (req, res) => {
    const { url } = req.query;

    if (!url) {
        console.error('No URL provided');
        return res.status(400).json({ message: 'No URL provided' });
    }

    let robotsTxtStatus = '';
    let sitemapStatus = '';

    try {
        // Check URL reachability
        const urlReachabilityResponse = await axios.get(url);
        if (urlReachabilityResponse.status !== 200) {
            return res.status(400).json({ message: 'Invalid URL' });
        }

        // 1. Checking for robots.txt
        const robotsTxtUrl = new URL('/robots.txt', url);
        const response = await axios.get(robotsTxtUrl.href);

        if (response.status === 200) {
            robotsTxtStatus = 'Robots.txt was found on your site';

            // 2. Checking for sitemap.xml inside robots.txt
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
    } catch (error) {
        console.error('Error fetching robots.txt:', error.message);
        return res.status(400).json({ message: 'Invalid URL' });
    }

    // Send the response with both statuses
    return res.json({ robotsTxtStatus, sitemapStatus });
});

// Start the server
server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
