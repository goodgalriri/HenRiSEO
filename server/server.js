const express = require('express');
const axios = require('axios');
const nodemailer = require('nodemailer');
const http = require('http');
const { JSDOM } = require('jsdom');

// Load environment variables from .env file
require('dotenv').config();

const app = express();
const port = 3001;

// Use environment variables for secret keys and API keys
const SECRET_KEY = process.env.RECAPTCHA_SERVER_KEY; // reCAPTCHA secret key
const API_KEY = process.env.PAGESPEED_API_KEY; // Google API key

// Nodemailer setup for Gmail SMTP
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.SMTP_USER, // Your Gmail address from .env
        pass: process.env.SMTP_PASS, // Your Gmail password from .env
    }
});

// Increase the max header size limit
const server = http.createServer(app);
server.maxHeaderSize = 32 * 1024; // 32KB

// Increase the limit for request headers
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Headers', '*');
    next();
});

// Middleware to parse JSON bodies with increased limits
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// reCAPTCHA verification route
app.post('/api/verify-recaptcha', async (req, res) => {
    const { token } = req.body;
    if (!token) {
        return res.status(400).json({ success: false, message: 'No reCAPTCHA token provided' });
    }

    try {
        const response = await axios.post('https://www.google.com/recaptcha/api/siteverify', null, {
            params: {
                secret: SECRET_KEY,
                response: token,
            },
        });

        const { success, score } = response.data;
        if (!success || (score && score < 0.5)) {
            return res.status(400).json({ success: false, message: 'reCAPTCHA verification failed' });
        }
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Verification failed' });
    }
});

// API route to check for robots.txt, sitemap, HTTPS, and mobile-friendliness
app.get('/api/check-robots', async (req, res) => {
    const { url } = req.query;

    if (!url) {
        return res.status(400).json({ message: 'No URL provided' });
    }

    let robotsTxtStatus = '';
    let sitemapStatus = '';
    let httpsStatus = '';
    let mobileFriendlyStatus = '';
    let coreWebVitals = {
        LCP: 'Not available',
        INP: 'Not available',
        CLS: 'Not available',
    };

    try {
        // Ensure the URL has a protocol
        let formattedUrl = url;
        if (!/^https?:\/\//i.test(url)) {
            formattedUrl = `http://${url}`;
        }

        // 1. Check URL reachability
        const initialResponse = await axios.get(formattedUrl);

        // 2. Checking for robots.txt
        const robotsTxtUrl = new URL('/robots.txt', formattedUrl);
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

        // 4. Check if HTTPS is used
        if (formattedUrl.startsWith('https://')) {
            httpsStatus = 'HTTPS is enabled on your site.';
        } else {
            httpsStatus = 'HTTPS is not enabled on your site.';
        }

        // 5. Check for mobile-friendliness
        const pageResponse = await axios.get(formattedUrl);
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
                return false;
            }
        });

        if (viewportMeta || mediaQueries || mobileFriendlyElements.length > 0) {
            mobileFriendlyStatus = 'The site is mobile-friendly.';
        } else {
            mobileFriendlyStatus = 'The site is not mobile-friendly.';
        }

        // 6. Fetch Core Web Vitals from PageSpeed Insights API
        const apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&key=${API_KEY}&category=PERFORMANCE`;
        const apiResponse = await axios.get(apiUrl);
        const lighthouseResult = apiResponse.data.lighthouseResult;

        if (lighthouseResult && lighthouseResult.audits) {
            const audits = lighthouseResult.audits;
            coreWebVitals.LCP = audits['largest-contentful-paint']?.displayValue || 'Not available';
            coreWebVitals.INP = audits['interactive']?.displayValue || 'Not available';
            coreWebVitals.CLS = audits['cumulative-layout-shift']?.displayValue || 'Not available';
        }

    } catch (error) {
        console.error('Error:', error.message);
        return res.status(400).json({ message: error.message || 'Failed to process the URL' });
    }

    // Send the response with all statuses
    return res.json({ robotsTxtStatus, sitemapStatus, httpsStatus, mobileFriendlyStatus, coreWebVitals });
});

app.post('/api/send-email', async (req, res) => {
    const { to, subject, text } = req.body;

    if (!to || !subject || !text) {
        return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const mailOptions = {
        from: process.env.SMTP_USER, 
        to,
        subject,
        text
    };

    try {
        await transporter.sendMail(mailOptions);
        res.json({ success: true, message: 'Email sent successfully' });
    } catch (error) {
        console.error('Error sending email:', error.message);
        res.status(500).json({ success: false, message: 'Failed to send email' });
    }
});

// Start the server
server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
