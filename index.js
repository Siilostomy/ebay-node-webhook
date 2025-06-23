const express = require('express');
const app = express();
const { createHash } = require('crypto');

const PORT = process.env.PORT || 3000;

const VERIFICATION_TOKEN = 'ebay_zapier_verification_token_2025_super_secure_key_abc9';
const ENDPOINT_URL = 'https://ebay-node-webhook.onrender.com'; // Update this if it's different

app.use(express.json());
app.use(express.text({ type: 'text/plain' }));

app.post('/', (req, res) => {
    const contentType = req.headers['content-type'];

    if (contentType === 'application/json') {
        console.log('✅ Received JSON from eBay');
        console.log(JSON.stringify(req.body, null, 2));
        res.sendStatus(200);
    } else if (contentType === 'text/plain') {
        console.log('✅ Verification request from Zapier');
        res.set('Content-Type', 'text/plain');
        res.status(200).send(VERIFICATION_TOKEN);
    } else {
        console.log('❌ Unsupported content type:', contentType);
        res.sendStatus(415);
    }
});

// Optional: handle GET challenge request (only needed if you expect one from eBay during validation)
app.get('/', (req, res) => {
    const challengeCode = req.query.challenge_code;
    if (!challengeCode) {
        return res.status(400).send('Missing challenge_code');
    }

    const hash = createHash('sha256');
    hash.update(challengeCode);
    hash.update(VERIFICATION_TOKEN);
    hash.update(ENDPOINT_URL);
    const responseHash = hash.digest('hex');

    res.set('Content-Type', 'application/json');
    res.status(200).json({ challengeResponse: responseHash });
});

app.listen(PORT, () => {
    console.log(`✅ Webhook server is running on port ${PORT}`);
});
