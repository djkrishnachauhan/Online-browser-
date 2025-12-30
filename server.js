const express = require('express');
const puppeteer = require('puppeteer');

const app = express();
const port = process.env.PORT || 3000; // Render PORT env var use karega

// Replace with your 10 URLs
const urls = [
  'https://example.com/1',
  'https://example.com/2',
  'https://example.com/3',
  'https://example.com/4',
  'https://example.com/5',
  'https://example.com/6',
  'https://example.com/7',
  'https://example.com/8',
  'https://example.com/9',
  'https://example.com/10'
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
