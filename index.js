const express = require('express');
const crypto = require('crypto');
const app = express();

const PORT = process.env.PORT || 3000;
const VERIFICATION_TOKEN = 'ebay_zapier_verification_token_2025_super_secure_key_abc9';
const ENDPOINT_URL = 'https://ebay-node-webhook.onrender.com';

// Accept JSON and plain text
app.use(express.json());
app.use(express.text({ type: 'text/plain' }));

// 🔐 GET route for eBay validation
app.get('/', (req, res) => {
  const challengeCode = req.query.challenge_code;

  if (!challengeCode) {
    return res.status(400).send('Missing challenge_code');
  }

  const hash = crypto.createHash('sha256');
  hash.update(challengeCode);
  hash.update(VERIFICATION_TOKEN);
  hash.update(ENDPOINT_URL);

  const responseHash = hash.digest('hex');

  res.status(200).json({ challengeResponse: responseHash });
});

// 🔁 POST route for Zapier or eBay events
app.post('/', (req, res) => {
  const contentType = req.headers['content-type'];

  if (contentType === 'application/json') {
    if (req.body && req.body.challenge) {
      // This is a Zapier verification call
      return res.status(200).type('text/plain').send(VERIFICATION_TOKEN);
    }

    console.log('📨 Received eBay webhook:');
    console.log(JSON.stringify(req.body, null, 2));
    return res.sendStatus(200); // Acknowledge event
  }

  if (contentType === 'text/plain') {
    // Plain text from Zapier or manual curl
    return res.status(200).type('text/plain').send(VERIFICATION_TOKEN);
  }

  return res.sendStatus(415); // Unsupported Media Type
});

app.listen(PORT, () => {
  console.log(`✅ Webhook server running on port ${PORT}`);
});
