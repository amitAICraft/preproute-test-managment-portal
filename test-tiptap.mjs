import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  await page.setViewport({ width: 1280, height: 800 });

  page.on('console', msg => console.log('BROWSER_LOG:', msg.text()));
  page.on('pageerror', error => console.log('BROWSER_ERROR:', error.message));

  console.log('Navigating to login...');
  await page.goto('http://localhost:3000/login');
  
  await page.type('input[type="email"]', 'vedant-admin');
  await page.type('input[type="password"]', 'vedant123');
  await page.click('button[type="submit"]');

  console.log('Waiting for navigation...');
  await page.waitForNavigation();

  console.log('Navigating to question builder...');
  await page.goto('http://localhost:3000/tests/create/questions?testId=1c4fddb2-d037-41a0-84f1-d08f9d29fd8d');
  
  console.log('Waiting for Tiptap Editor to load...');
  await page.waitForSelector('.ProseMirror', { timeout: 5000 });
  
  // Click on the bold button to activate it
  console.log('Clicking Bold button...');
  await page.evaluate(() => {
    const boldBtn = document.querySelector('button .lucide-bold')?.closest('button');
    if (boldBtn) boldBtn.click();
  });
  
  console.log('Typing into the editor...');
  await page.focus('.ProseMirror');
  await page.keyboard.type('This is a test from Tiptap Editor!');
  
  await new Promise(r => setTimeout(r, 1000));
  
  console.log('Capturing screenshot...');
  await page.screenshot({ path: 'tiptap_screenshot.png' });
  
  const content = await page.evaluate(() => {
    return document.querySelector('.ProseMirror')?.innerHTML;
  });
  console.log('Tiptap HTML Content:', content);
  
  await browser.close();
})();
