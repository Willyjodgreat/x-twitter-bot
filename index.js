const chromium = require('@sparticuz/chromium');
const puppeteer = require('puppeteer-core');
require('dotenv').config();
const express = require('express');

const app = express();
app.use(express.json());

const port = process.env.PORT || 3000;

// LOGIN + BROWSER FUNCTION
async function createBrowserSession() {
  const browser = await puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath(),
    headless: chromium.headless
  });

  const page = await browser.newPage();
  await page.goto('https://x.com/login', { waitUntil: 'networkidle0' });

  // Username
  await page.waitForSelector('input[autocomplete="username"]');
  await page.type('input[autocomplete="username"]', process.env.X_USERNAME);
  await page.keyboard.press('Enter');

  // Password
  await page.waitForSelector('input[autocomplete="current-password"]');
  await page.type('input[autocomplete="current-password"]', process.env.X_PASSWORD);
await page.keyboard.press('Enter');

await page.waitForNavigation({ waitUntil: 'networkidle2' });

return { browser, page };
}

// POST A TWEET (EXAMPLE)
app.get('/tweet', async (req, res) => {
  try {
    const { browser, page } = await createBrowserSession();

    await page.waitForSelector('div[aria-label="Tweet text"]');
    await page.type('div[aria-label="Tweet text"]', 'Test tweet by bot 🤖');

    await page.click('div[data-testid="tweetButtonInline"]');

    await browser.close();
    res.send({ status: 'Tweet posted!' });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// REPLY TO A COMMENT
async function replyToComment(commentId, replyText) {
  const { browser, page } = await createBrowserSession();

  // Navigate to the tweet activity URL
  await page.goto(`https://vk.com/1/activity/${commentId}`, {
    waitUntil: 'networkidle0',
  });

  // Reply
  await page.waitForSelector('div[aria-label="Reply text"]');
  await page.type('div[aria-label="Reply text"]', replyText);
  await page.click('div[data-testid="replyButton"]');

  await browser.close();
}
 app.post('/reply', async (req, res) => {
  const { commentId, replyText } = req.body;

  if (!commentId || !replyText) {
    return res.status(400).send({
      error: 'Missing commentId or replyText',
    });
  }

  try {
    await replyToComment(commentId, replyText);
    res.send({ status: 'Reply sent!' });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// HOME ROUTE
app.get('/', (req, res) => {
  res.send('Bot is alive! 🧠⚡️');
});


// SERVER START
app.listen(port, () => {
  console.log(Bot listening on port ${port});
});

