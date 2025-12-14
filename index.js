const express = require('express');
const axios = require('axios');
const app = express();

// Your proxy chain entry point
const PROXY = 'https://amesterdam.onrender.com';

// Test endpoint
app.get('/', (req, res) => {
    res.send('Main App Alive! Use /test to check Binance.');
});

// Test Binance connection
app.get('/test', async (req, res) => {
    try {
        const ping = await axios.get(`${PROXY}/binance/api/v3/ping`);
        const price = await axios.get(`${PROXY}/binance/api/v3/ticker/price?symbol=BTCUSDT`);
        
        res.json({
            status: '✅ SUCCESS',
            ping: ping.data,
            btcPrice: price.data
        });
    } catch (e) {
        res.json({
            status: '❌ FAILED',
            error: e.message
        });
    }
});

// Get any price
app.get('/price/:symbol', async (req, res) => {
    try {
        const response = await axios.get(
            `${PROXY}/binance/api/v3/ticker/price?symbol=${req.params.symbol}`
        );
        res.json(response.data);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// Get klines/candles
app.get('/klines/:symbol/:interval', async (req, res) => {
    try {
        const response = await axios.get(
            `${PROXY}/binance/api/v3/klines?symbol=${req.params.symbol}&interval=${req.params.interval}&limit=100`
        );
        res.json(response.data);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.listen(process.env.PORT || 3000);
