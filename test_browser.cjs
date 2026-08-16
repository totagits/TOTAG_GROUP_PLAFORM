
const puppeteer = require('puppeteer');

(async () => {
  let browser;
  try {
    browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    
    page.on('console', msg => console.log('BROWSER CONSOLE:', msg.type(), msg.text()));
    page.on('pageerror', error => console.error('BROWSER ERROR:', error.message));

    console.log('Navigating to http://totag.network...');
    await page.goto('http://totag.network', { waitUntil: 'networkidle0', timeout: 15000 });
    console.log('Page loaded. Content length:', (await page.content()).length);
  } catch (e) {
    console.error('PUPPETEER EXCEPTION:', e.message);
  } finally {
    if (browser) await browser.close();
  }
})();
