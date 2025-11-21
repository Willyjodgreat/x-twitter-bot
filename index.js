import express from 'express';
import puppeteer from 'puppeteer';

const app = express();
app.use(express.json());

app.post('/reply', async (req, res) => {
  const { tweetUrl, replyText } = req.body;
  if (!tweetUrl || !replyText) return res.status(400).send("Missing data");

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  try {
    // LOGIN TO TWITTER
    await page.goto('https://twitter.com/login', { waitUntil: 'networkidle2' });

    await page.type('input[name="text"]', process.env.TWITTER_USERNAME || 'web3chaos969');
    await page.click('div[role="button"]');
    await page.waitForTimeout(1000);

    await page.type('input[name="password"]', process.env.TWITTER_PASSWORD || 'Willyjo@969');
    await page.click('div[data-testid="LoginForm_Login_Button"]');

    await page.waitForNavigation({ waitUntil: 'networkidle2' });

    // GO TO TWEET & REPLY
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

app.listen(3000, () => console.log('🚀 Server running on port 3000'));
