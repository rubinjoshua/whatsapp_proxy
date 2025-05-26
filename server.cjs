const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const app = express();

app.get('/qr', (req, res) => {
  const qrPath = path.join(__dirname, 'qr.png');
  if (fs.existsSync(qrPath)) {
    res.sendFile(qrPath);
  } else {
    res.status(404).send('QR code not yet generated');
  }
});

app.use(
  '/',
  createProxyMiddleware({
    target: 'https://web.whatsapp.com',
    changeOrigin: true,
    onProxyReq: (proxyReq, req, res) => {
      proxyReq.setHeader(
        'User-Agent',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
      );
      proxyReq.setHeader('Accept-Language', 'en-US,en;q=0.9');
      proxyReq.setHeader('Upgrade-Insecure-Requests', '1');
    },
    onProxyRes: (proxyRes) => {
      delete proxyRes.headers['content-security-policy'];
      delete proxyRes.headers['x-frame-options'];
    },
    selfHandleResponse: false,
    ws: true,
  })
);

// Start Puppeteer QR capture
spawn('node', ['qr_capture.mjs'], { stdio: 'inherit' });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Proxy running at http://localhost:${PORT}`);
});