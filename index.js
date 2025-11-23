const chromium = require('@sparticuz/chromium');
const puppeteer = require('puppeteer-core');

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
  await page.type('div[aria-label="Tweet text"]', 'Automated test post by bot 🤖');
  await page.click('div[data-testid="tweetButtonInline"]');

  console.log('Tweet posted!');
  await browser.close();
})();
