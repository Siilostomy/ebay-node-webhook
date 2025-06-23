const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

const VERIFICATION_TOKEN = 'ebay_zapier_verification_token_2025_super_secure_key_abc9';

// Accept JSON and plain text
app.use(express.json());
app.use(express.text({ type: 'text/plain' }));

// eBay will send POST to "/"
app.post('/', (req, res) => {
  const contentType = req.headers['content-type'];

  if (contentType === 'application/json') {
    console.log('🔔 Received eBay JSON webhook:');
    console.log(JSON.stringify(req.body, null, 2));
    // Respond with 200 OK (no body required)
    res.sendStatus(200);
  } else if (contentType === 'text/plain') {
    // Zapier sends plain text for verification
    res.set('Content-Type', 'text/plain');
    res.status(200).send(VERIFICATION_TOKEN);
  } else {
    res.sendStatus(415); // Unsupported Media Type
  }
});

app.listen(PORT, () => {
  console.log(`✅ Webhook server is running on port ${PORT}`);
});
