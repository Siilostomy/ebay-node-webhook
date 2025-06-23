const express = require('express');
const crypto = require('crypto');
const app = express();
const PORT = process.env.PORT || 3000;

const VERIFICATION_TOKEN = 'ebay_zapier_verification_token_2025_super_secure_key_abc9';
const ENDPOINT_URL = 'https://ebay-node-webhook.onrender.com/'; // must match exactly

// Middleware to handle POST bodies
app.use(express.json());
app.use(express.text({ type: 'text/plain' }));

// Handle POST requests from eBay (account deletion) and Zapier (text)
app.post('/', (req, res) => {
  const contentType = req.headers['content-type'];

  if (contentType === 'application/json') {
    console.log('✅ Received eBay JSON webhook:');
    console.log(JSON.stringify(req.body, null, 2));
    res.sendStatus(200);
  } else if (contentType === 'text/plain') {
    // Zapier token verification
    res.set('Content-Type', 'text/plain');
    res.status(200).send(VERIFICATION_TOKEN);
  } else {
    res.sendStatus(415); // Unsupported media type
  }
});

// 🔥 Handle GET from eBay for challenge verification
app.get('/', (req, res) => {
  const challengeCode = req.query.challenge_code;

  if (!challengeCode) {
    return res.status(400).send('Missing challenge_code');
  }

  // Build SHA-256 hash of: challengeCode + verificationToken + endpoint
  const hash = crypto.createHash('sha256');
  hash.update(challengeCode);
  hash.update(VERIFICATION_TOKEN);
  hash.update(ENDPOINT_URL);
  const challengeResponse = hash.digest('hex');

  console.log('🔐 Responding to challenge:', challengeResponse);

  res.setHeader('Content-Type', 'application/json');
  res.status(200).json({ challengeResponse });
});

app.listen(PORT, () => {
  console.log(`🚀 Webhook server running on port ${PORT}`);
});
