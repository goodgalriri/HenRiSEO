const express = require('express');
const fetch = require('node-fetch');
const app = express();
const port = 3001; // Ensure this port does not conflict with your frontend

app.get('/api/check-robots', async (req, res) => {
  const { url } = req.query;
  
  try {
    const robotsTxtUrl = new URL('/robots.txt', url);
    const response = await fetch(robotsTxtUrl.href);
    
    if (response.ok) {
      res.json({ message: 'Robots.txt was found on your site' });
    } else {
      res.json({ message: 'Robots.txt was not found on your site' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to check robots.txt. Please ensure your URL is correct and try again.' });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
