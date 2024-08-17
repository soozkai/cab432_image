const fs = require('fs');
const path = require('path');

// Function to calculate Simple Moving Average (SMA)
function calculateSMA(prices, window) {
    return prices.map((_, idx, arr) => {
        if (idx < window) return null;  // Skip if the window isn't full yet
        const windowPrices = arr.slice(idx - window, idx);
        const sum = windowPrices.reduce((acc, price) => acc + price, 0);
        return sum / window;
    });
}

// Function to calculate Exponential Moving Average (EMA)
function calculateEMA(prices, window) {
    const k = 2 / (window + 1);
    let emaArray = [prices[0]]; // Start with the first price as the initial EMA
    for (let i = 1; i < prices.length; i++) {
        const ema = prices[i] * k + emaArray[i - 1] * (1 - k);
        emaArray.push(ema);
    }
    return emaArray;
}

// Function to simulate a crossover strategy (for both SMA and EMA)
function simulateCrossoverStrategy(shortMA, longMA) {
    let signals = [];
    for (let i = 1; i < shortMA.length; i++) {
        if (shortMA[i] && longMA[i]) {
            if (shortMA[i] > longMA[i] && shortMA[i - 1] <= longMA[i - 1]) {
                signals.push({ signal: 'BUY', price: shortMA[i] });
            } else if (shortMA[i] < longMA[i] && shortMA[i - 1] >= longMA[i - 1]) {
                signals.push({ signal: 'SELL', price: shortMA[i] });
            }
        }
    }
    return signals;
}

function runBacktest(data, shortWindow, longWindow) {
    let shortMovingAverage = [];
    let longMovingAverage = [];
    let volatility = [];
    let sharpeRatio = [];
    const riskFreeRate = 0.01; // Example risk-free rate for Sharpe ratio calculation

    for (let i = shortWindow - 1; i < data.length; i++) {
        let shortSum = 0, longSum = 0, returns = [];

        // Calculate moving averages
        for (let j = i - shortWindow + 1; j <= i; j++) {
            shortSum += data[j].close;
            if (j >= longWindow - 1) longSum += data[j].close;
            if (j > 0) returns.push(data[j].close / data[j - 1].close - 1);
        }

        shortMovingAverage.push(shortSum / shortWindow);
        if (i >= longWindow - 1) longMovingAverage.push(longSum / longWindow);

        // Calculate volatility (standard deviation of returns)
        if (returns.length > 0) {
            const meanReturn = returns.reduce((acc, r) => acc + r, 0) / returns.length;
            const squaredDiffs = returns.map(r => Math.pow(r - meanReturn, 2));
            const variance = squaredDiffs.reduce((acc, sd) => acc + sd, 0) / returns.length;
            volatility.push(Math.sqrt(variance));
        }

        // Calculate Sharpe ratio (returns adjusted by risk-free rate, divided by volatility)
        if (volatility.length > 0 && volatility[volatility.length - 1] !== 0) {
            const excessReturn = meanReturn - riskFreeRate;
            sharpeRatio.push(excessReturn / volatility[volatility.length - 1]);
        }
    }

    return {
        shortMovingAverage,
        longMovingAverage,
        volatility,
        sharpeRatio,
        data: data.slice(longWindow - 1) // Trimming the data to align with the long moving average
    };
}

module.exports = { runBacktest };
