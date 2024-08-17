const express = require('express');
const { fetchHistoricalData } = require('./fetchdata');
const { runBacktest } = require('./backtest');
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

// Run backtest endpoint
app.get('/backtest/:symbol', (req, res) => {
    const { symbol } = req.params;
    const { shortWindow = 10, longWindow = 50 } = req.query;

    // Fetch the historical data for backtesting
    const data = require(`../data/${symbol}_historical_data.json`);

    const backtestResults = runBacktest(data, parseInt(shortWindow), parseInt(longWindow));

    // Send the backtest results as JSON
    res.json({
        message: `Backtest completed for ${symbol}`,
        shortMovingAverage: backtestResults.shortMovingAverage,
        longMovingAverage: backtestResults.longMovingAverage,
        data: backtestResults.data,
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
