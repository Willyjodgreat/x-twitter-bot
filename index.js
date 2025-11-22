const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: '/usr/bin/google-chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.goto('https://x.com/login', { waitUntil: 'networkidle2' });

  // Login logic (fill in your credentials or use environment variables)
  await page.type('input[name="text"]', process.env.X_USERNAME, { delay: 100 });
  await page.keyboard.press('Enter');
  await page.waitForTimeout(2000);

  await page.type('input[name="password"]', process.env.X_PASSWORD, { delay: 100 });
  await page.keyboard.press('Enter');
  await page.waitForNavigation({ waitUntil: 'networkidle2' });

  // Post tweet
  const tweetText = "This is a test tweet from a bot!";
  await page.goto('https://x.com/compose/tweet');
  await page.waitForSelector('[data-testid="tweetTextarea_0"]');
  await page.type('[data-testid="tweetTextarea_0"]', tweetText, { delay: 50 });
  await page.click('[data-testid="tweetButtonInline"]');

  console.log('Tweet posted!');
  await browser.close();
})();
