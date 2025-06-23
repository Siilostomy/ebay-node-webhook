const express = require('express');
const bodyParser = require('body-parser');

const app = express();

// Add this line to handle JSON POST bodies properly
app.use(express.json()); // Built-in since Express 4.16+

// OR if you're using body-parser explicitly:
// app.use(bodyParser.json());

app.get('/', (req, res) => {
  const challengeCode = req.query.challenge_code;
  if (!challengeCode) {
    return res.status(400).send('Missing challenge_code');
  }

  const crypto = require('crypto');

  const verificationToken = 'ebay_zapier_verification_token_2025_super_secure_key_at'; // update this if needed
  const endpoint = 'https://ebay-node-webhook.onrender.com';

  const hash = crypto.createHash('sha256');
  hash.update(challengeCode);
  hash.update(verificationToken);
  hash.update(endpoint);
  const challengeResponse = hash.digest('hex');

  res.setHeader('Content-Type', 'application/json');
  res.status(200).json({ challengeResponse });
});

app.post('/', (req, res) => {
  console.log('Received eBay POST:', req.body);
  res.sendStatus(200); // Accept the notification
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
