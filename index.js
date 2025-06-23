const express = require('express');
const { createHash } = require('crypto');
const app = express();

const PORT = process.env.PORT || 3000;
const VERIFICATION_TOKEN = 'ebay_zapier_verification_token_2025_super_secure_key_abc9';
const ENDPOINT = 'https://ebay-node-webhook.onrender.com';

// Accept JSON and plain text
app.use(express.json());
app.use(express.text({ type: 'text/plain' }));

// ✅ Handle GET from eBay for challenge verification
app.get('/', (req, res) => {
  const challengeCode = req.query.challenge_code;

  if (!challengeCode) {
    return res.status(400).send('Missing challenge_code');
  }

  const hash = createHash('sha256');
  hash.update(challengeCode);
  hash.update(VERIFICATION_TOKEN);
  hash.update(ENDPOINT);
  const challengeResponse = hash.digest('hex');

  res.setHeader('Content-Type', 'application/json');
  return res.status(200).json({ challengeResponse });
});

// ✅ Handle POST (both eBay and Zapier)
app.post('/', (req, res) => {
  const contentType = req.headers['content-type'];

  if (contentType === 'application/json') {
    console.log('📩 Received eBay POST notification:');
    console.log(JSON.stringify(req.body, null, 2));
    res.sendStatus(200);
  } else if (contentType === 'text/plain') {
    res.set('Content-Type', 'text/plain');
    res.status(200).send(VERIFICATION_TOKEN);
  } else {
    res.sendStatus(415); // Unsupported Media Type
  }
});

app.listen(PORT, () => {
  console.log(`✅ Webhook server running on port ${PORT}`);
});
