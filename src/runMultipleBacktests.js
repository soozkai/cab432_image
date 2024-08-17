const fs = require('fs');
const path = require('path');
const { runBacktest } = require('./backtest');  // Assuming you have a separate backtest function

// Function to run backtests for multiple symbols
async function runMultipleBacktests(symbols, shortWindow, longWindow) {
    const results = [];

    for (const symbol of symbols) {
        const filePath = path.join(__dirname, '../data', `${symbol}_historical_data.json`);

        // Check if the historical data file exists
        if (fs.existsSync(filePath)) {
            const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

            // Ensure data structure is correct
            if (Array.isArray(data)) {
                // Run backtest for the symbol
                const backtestResult = runBacktest(data, shortWindow, longWindow);
                results.push({
                    symbol,
                    backtestResult,
                });
            } else {
                results.push({
                    symbol,
                    error: 'Invalid data format or empty data',
                });
            }
        } else {
            results.push({
                symbol,
                error: `No historical data found for ${symbol}`,
            });
        }
    }

    return results;
}

module.exports = { runMultipleBacktests };
