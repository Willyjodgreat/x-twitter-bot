const chromium = require('@sparticuz/chromium');
const puppeteer = require('puppeteer-core');
require('dotenv').config();

(async () => {
  const browser = await puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath(),
    headless: chromium.headless,
  });

  const page = await browser.newPage();
  await page.goto('https://x.com/login', { waitUntil: 'networkidle0' });

  // Type username
  await page.waitForSelector('input[autocomplete="username"]');
  await page.type('input[autocomplete="username"]', process.env.X_USERNAME);
  await page.keyboard.press('Enter');

  // Wait and type password
  await page.waitForSelector('input[autocomplete="current-password"]', { timeout: 10000 });
  await page.type('input[autocomplete="current-password"]', process.env.X_PASSWORD);
  await page.keyboard.press('Enter');

  // Wait for login success
  await page.waitForNavigation({ waitUntil: 'networkidle2' });

  // Post a tweet
  await page.waitForSelector('div[aria-label="Tweet text"]', { timeout: 10000 });
  await page.type('div[aria-label="Tweet text"]', 'Test tweet by bot 🤖 #automated');

  await page.click('div[data-testid="tweetButtonInline"]');

  console.log('✅ Tweet posted!');
  await browser.close();
})();

// Dummy express server for Render
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
app.get('/', (req, res) => res.send('Bot is alive! 🧠⚡️'));
app.listen(port, () => console.log(`Listening on port ${port}`));
const express = require('express');
const app = express();
app.use(express.json());

const port = process.env.PORT || 3000;

// Your Puppeteer setup here (login, etc.)
// Put your reply logic in a function:
async function replyToComment(commentId, replyText) {
  // Use Puppeteer to open X, find the comment by ID, and reply with replyText
  // This part depends on X UI structure, example below:
  const browser = await puppeteer.launch({ /* your chromium config */ });
  const page = await browser.newPage();

  // Login steps here...

  // Navigate to the comment by ID (example URL)
  await page.goto(`https://x.com/i/activity/${commentId}`);

  // Wait for reply box, type replyText
  await page.waitForSelector('div[aria-label="Reply text"]');
  await page.type('div[aria-label="Reply text"]', replyText);

  // Click reply button
  await page.click('div[data-testid="replyButton"]');

  await browser.close();
}

app.post('/reply', async (req, res) => {
  const { commentId, replyText } = req.body;
  if (!commentId || !replyText) {
    return res.status(400).send({ error: 'Missing commentId or replyText' });
  }

  try {
    await replyToComment(commentId, replyText);
    res.send( status: 'Reply sent!' );
   catch (error) 
    res.status(500).send( error: error.message );
  );

app.listen(port, () => console.log(`Bot listening on port{port}`));

