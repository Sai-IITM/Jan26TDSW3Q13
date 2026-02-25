const { chromium } = require('playwright');

async function scrapeSums(urls) {
  const browser = await chromium.launch({ headless: true });
  let grandTotal = 0;

  for (const url of urls) {
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle' });  // Wait for dynamic tables to load

    // Find all table cells with numbers (handles dynamic content)
    const numbers = await page.evaluate(() => {
      const nums = [];
      document.querySelectorAll('table td, table th').forEach(cell => {
        const text = cell.textContent.trim();
        const num = parseFloat(text);
        if (!isNaN(num)) nums.push(num);
      });
      return nums;
    });

    const sum = numbers.reduce((acc, n) => acc + n, 0);
    grandTotal += sum;
    console.log(`Sum for ${url}: ${sum} (found ${numbers.length} numbers)`);
    await page.close();
  }

  await browser.close();
  console.log(`GRAND TOTAL SUM: ${grandTotal}`);
  return grandTotal;
}

const urls = [
  'https://sanand0.github.io/tdsdata/js_table/?seed=14',
  'https://sanand0.github.io/tdsdata/js_table/?seed=15',
  'https://sanand0.github.io/tdsdata/js_table/?seed=16',
  'https://sanand0.github.io/tdsdata/js_table/?seed=17',
  'https://sanand0.github.io/tdsdata/js_table/?seed=18',
  'https://sanand0.github.io/tdsdata/js_table/?seed=19',
  'https://sanand0.github.io/tdsdata/js_table/?seed=20',
  'https://sanand0.github.io/tdsdata/js_table/?seed=21',
  'https://sanand0.github.io/tdsdata/js_table/?seed=22',
  'https://sanand0.github.io/tdsdata/js_table/?seed=23'
];

scrapeSums(urls).catch(console.error);
