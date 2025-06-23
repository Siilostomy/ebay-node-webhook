const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

const VERIFICATION_TOKEN = 'ebay_zapier_verification_token_2025_super_secure_key_abc9';

// Accept both JSON and plain text
app.use(express.json());
app.use(express.text({ type: 'text/plain' }));

// Handle POST requests
app.post('/', (req, res) => {
  const contentType = req.headers['content-type'];

  if (contentType === 'application/json') {
    // ✅ eBay webhook
    console.log('📨 Received eBay JSON webhook:');
    console.log(JSON.stringify(req.body, null, 2));
    return res.sendStatus(200); // ✅ Correct for eBay: just acknowledge receipt
  }

  if (contentType === 'text/plain') {
    // ✅ Zapier token verification (or eBay sandbox test)
    return res.status(200).set('Content-Type', 'text/plain').send(VERIFICATION_TOKEN);
  }

  // ❌ Unsupported content type
  res.sendStatus(415);
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Webhook server is running on port ${PORT}`);
});
