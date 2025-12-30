const express = require('express');
const puppeteer = require('puppeteer');

const app = express();
const port = process.env.PORT || 3000; // Render PORT env var use karega

// Replace with your 10 URLs
const urls = [
  'https://youtu.be/RXwYYWHjJ1w?si=dnCa-KQIDuIGxtOR',
  'https://youtu.be/o6tX6zWU2ME?si=WyECncRqEMC-bgw3',
  'https://youtu.be/OoOozEzLyk4?si=u6Ieeo77xQP9b1mg',
  'https://youtu.be/Q0v-WSguTnk?si=YFoBw3YxRdj6uGz_',
  'https://youtu.be/8uDJz--LAn0?si=_Q_aBK6xeYd4YHOh',
  'https://youtu.be/sQbEQktxdXs?si=1t86zvLW7Fm8g6JQ',
  'https://youtu.be/Ibca5DYxOwY?si=reE5VV07_HdxVKxN',
  'https://youtu.be/_fuoSEe5Rsk?si=wh-hbaY2YelGKerK',
  'https://youtu.be/Q0YkHEwyIjA?si=hPG1xqb3KZ-MEQcZ',
  'https://youtu.be/VdOIdmrYwKY?si=jvb5BiC2RB2tQP5H',
  'https://youtu.be/NSK10_ZqUIo?si=0cbitMJ3gyzIJZFe'
];

let browser;
let page;

async function startBrowserAutomation() {
  try {
    console.log('Launching Puppeteer...');
    browser = await puppeteer.launch({
      headless: true, // Must be true for Render
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--disable-gpu',
        '--disable-features=IsolateOrigins,site-per-process',
        '--disable-background-timer-throttling',
        '--disable-backgrounding-occluded-windows',
        '--disable-renderer-backgrounding',
        '--single-process' // Memory optimize
      ],
      executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined
    });

    page = await browser.newPage();
    console.log('Browser launched successfully.');

    // Function to navigate to random URL
    async function navigateToRandomUrl() {
      const randomIndex = Math.floor(Math.random() * urls.length);
      const randomUrl = urls[randomIndex];
      console.log(`Navigating to: ${randomUrl}`);
      try {
        await page.goto(randomUrl, { waitUntil: 'networkidle2', timeout: 60000 });
        console.log(`Loaded: ${randomUrl}`);
      } catch (error) {
        console.error(`Error loading ${randomUrl}: ${error.message}`);
      }
    }

    // Initial navigation
    await navigateToRandomUrl();

    // Every 1 minute (60 seconds)
    setInterval(navigateToRandomUrl, 60 * 1000);
  } catch (error) {
    console.error('Failed to launch browser:', error);
  }
}

// Start automation
startBrowserAutomation();

// Basic endpoint to keep server alive
app.get('/', (req, res) => {
  res.send('Server is running and Puppeteer is active.');
});

// Graceful shutdown
process.on('SIGINT', async () => {
  if (browser) await browser.close();
  process.exit();
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
