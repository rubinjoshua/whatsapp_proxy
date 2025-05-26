import puppeteer from 'puppeteer';
import fs from 'fs';

console.log('Executable path:', puppeteer.executablePath());

const captureQR = async () => {
    
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    executablePath: puppeteer.executablePath(),  // <-- force the correct binary
  });

  const page = await browser.newPage();

  await page.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
  );

  await page.goto('https://web.whatsapp.com', {
    waitUntil: 'networkidle2',
    timeout: 0
  });

  console.log('Waiting for QR code...');
  await page.waitForSelector('canvas[aria-label="Scan this QR code to link a device!"]', { timeout: 60000 });

  const qrElement = await page.$('canvas[aria-label="Scan this QR code to link a device!"]');
  if (fs.existsSync('qr.png')) {
    fs.unlinkSync('qr.png');
  }
  await qrElement.screenshot({ path: 'qr.png' });

  console.log('QR code saved to qr.png');
  await browser.close();
};

captureQR().catch(console.error);