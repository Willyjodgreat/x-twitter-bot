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

  // Go to X with longer timeout
  await page.goto('https://x.com/login', {
    waitUntil: 'networkidle0',
    timeout: 0, // remove time limit
  });

  // Example login & post (replace with real selectors & values)
  await page.type('input[name="text"]', 'your_username');
  await page.click('div[role="button"]'); // next or login
  await page.waitForTimeout(1000); // wait

  await page.type('input[name="password"]', 'your_password');
  await page.click('div[role="button"]'); // login button
  await page.waitForNavigation({ waitUntil: 'networkidle0' });

  await page.goto('https://x.com/compose/tweet', { waitUntil: 'networkidle0' });
  await page.type('div[aria-label="Tweet text"]', 'Hello world from Puppeteer bot!');
  await page.click('div[data-testid="tweetButtonInline"]');

  await browser.close();
})();
