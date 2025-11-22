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

  // Simulate typing login details (use env vars for safety)
  await page.type('input[name="text"]', process.env.X_USERNAME);
  await page.keyboard.press('Enter');
  await page.waitForTimeout(1000);
  await page.type('input[name="password"]', process.env.X_PASSWORD);
  await page.keyboard.press('Enter');

  await page.waitForNavigation({ waitUntil: 'networkidle0' });

  // Compose tweet
  await page.goto('https://x.com/compose/tweet');
  await page.waitForSelector('[data-testid="tweetTextarea_0"]');
  await page.type('[data-testid="tweetTextarea_0"]', 'Yo this is an automated tweet 🚀');
  await page.click('[data-testid="tweetButtonInline"]');

  console.log('✅ Tweet posted successfully!');
  await browser.close();
})();
