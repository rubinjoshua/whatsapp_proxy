const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

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
    onProxyRes: (proxyRes, req, res) => {
      // optional: remove CSP headers that might block scripts
      delete proxyRes.headers['content-security-policy'];
      delete proxyRes.headers['x-frame-options'];
    },
    selfHandleResponse: false,
    ws: true,
  })
);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Proxy running at http://localhost:${PORT}`);
});