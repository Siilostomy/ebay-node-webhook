const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

const VERIFICATION_TOKEN = 'ebay_zapier_verification_token_2025_super_secure_key_abc9';

app.use(express.text({ type: '*/*' }));

app.post('/', (req, res) => {
  res.set('Content-Type', 'text/plain');
  res.status(200).send(VERIFICATION_TOKEN);
});

app.listen(PORT, () => {
  console.log(`✅ Webhook server is running on port ${PORT}`);
});
