const express = require('express');
const { fetchHistoricalData } = require('./fetchdata');
const { runMultipleBacktests } = require('./runMultipleBacktests'); // Updated import
const path = require('path');
const cors = require('cors');
const app = express();
const port = 3000;

// Enable CORS
app.use(cors());

// Serve static files (e.g., HTML, CSS, JS) from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve the index.html when accessing the root URL
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Fetch historical data endpoint
app.get('/fetch-data/:symbol', async (req, res) => {
    const { symbol } = req.params;
    await fetchHistoricalData(symbol);
    res.send(`Historical data for ${symbol} fetched and saved.`);
});

// Run multiple backtests endpoint
app.get('/backtest', async (req, res) => {
    const { shortWindow = 10, longWindow = 50 } = req.query;
    const symbols = ['BTC', 'ETH', 'LTC'];  // You can add more symbols here

    try {
        // Run backtests for multiple symbols
        const results = await runMultipleBacktests(symbols, parseInt(shortWindow), parseInt(longWindow));
        
        // Send the results as JSON
        res.json({
            message: 'Backtests completed',
            results
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
