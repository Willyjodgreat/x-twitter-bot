import express from 'express';
import puppeteer from 'puppeteer-core';
import { executablePath } from 'puppeteer';

const app = express();
app.use(express.json());

app.post('/reply', async (req, res) => {
  const { tweetUrl, replyText } = req.body;
  if (!tweetUrl || !replyText) return res.status(400).send("Missing data");

  const browser = await puppeteer.launch({
    headless: true,
    executablePath: executablePath(), // uses system Chrome
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  try {
    await page.goto('https://twitter.com/login');

    // 🔐 Add your login automation here (or use cookies/session)

    await page.goto(tweetUrl, { waitUntil: 'networkidle2' });
    await page.click('[data-testid="reply"]');
    await page.waitForSelector('div[role="textbox"]');
    await page.type('div[role="textbox"]', replyText);
    await page.click('[data-testid="tweetButton"]');

    await browser.close();
    res.send("✅ Replied successfully");
  } catch (err) {
    await browser.close();
    res.status(500).send("❌ Failed: " + err.message);
  }
});

app.listen(3000, () => console.log('🚀 Bot running on port 3000'));
