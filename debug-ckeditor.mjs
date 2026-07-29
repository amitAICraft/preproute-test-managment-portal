import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

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
  
  console.log('Waiting for CKEditor to load...');
  await new Promise(r => setTimeout(r, 5000)); // wait 5s

  const ckEditorInfo = await page.evaluate(() => {
    const editables = document.querySelectorAll('.ck-editor__editable');
    const results = [];
    editables.forEach(el => {
      const styles = window.getComputedStyle(el);
      results.push({
        html: el.outerHTML,
        isContentEditable: el.isContentEditable,
        pointerEvents: styles.pointerEvents,
        userSelect: styles.userSelect,
        display: styles.display,
        visibility: styles.visibility,
        opacity: styles.opacity,
        zIndex: styles.zIndex,
        position: styles.position,
        height: styles.height,
        classes: el.className
      });
    });
    
    // Also check for any overlays
    const overlays = [];
    document.querySelectorAll('*').forEach(el => {
       const styles = window.getComputedStyle(el);
       if (styles.position === 'absolute' || styles.position === 'fixed') {
         if (styles.zIndex > 0 && styles.pointerEvents !== 'none') {
             overlays.push({ tag: el.tagName, classes: el.className, zIndex: styles.zIndex });
         }
       }
    });

    return {
      editables: results,
      overlays: overlays.slice(0, 5) // just top 5
    };
  });

  console.log('CKEditor Info:', JSON.stringify(ckEditorInfo, null, 2));

  await browser.close();
})();
