// backtest.js

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

// Function to calculate volatility (standard deviation of returns)
function calculateVolatility(returns) {
    if (returns.length === 0) return null;

    const meanReturn = returns.reduce((acc, r) => acc + r, 0) / returns.length;
    const squaredDiffs = returns.map(r => Math.pow(r - meanReturn, 2));
    const variance = squaredDiffs.reduce((acc, sd) => acc + sd, 0) / returns.length;

    return Math.sqrt(variance);
}

// Function to calculate Sharpe Ratio
function calculateSharpeRatio(meanReturn, volatility, riskFreeRate) {
    if (volatility === 0 || volatility === null) return null;
    const excessReturn = meanReturn - riskFreeRate;
    return excessReturn / volatility;
}

// Function to calculate Mean Return
function calculateMeanReturn(returns) {
    if (returns.length === 0) return null;
    return returns.reduce((acc, ret) => acc + ret, 0) / returns.length;
}

// Backtest Function
function runBacktest(data, shortWindow, longWindow) {
    let shortMovingAverage = calculateSMA(data.map(d => d.close), shortWindow);
    let longMovingAverage = calculateSMA(data.map(d => d.close), longWindow);
    let volatility = [];
    let sharpeRatio = [];
    const riskFreeRate = 0.01; // Example risk-free rate for Sharpe ratio calculation

    // Calculate returns, volatility, and Sharpe ratio
    let returns = [];
    for (let i = 1; i < data.length; i++) {
        returns.push(data[i].close / data[i - 1].close - 1);
    }

    let meanReturn = calculateMeanReturn(returns);
    let vol = calculateVolatility(returns);

    for (let i = longWindow - 1; i < data.length; i++) {
        volatility.push(vol);
        sharpeRatio.push(calculateSharpeRatio(meanReturn, vol, riskFreeRate));
    }

    // Trimming the data to align with the long moving average
    return {
        shortMovingAverage: shortMovingAverage.slice(longWindow - 1),
        longMovingAverage: longMovingAverage.slice(longWindow - 1),
        volatility,
        sharpeRatio,
        data: data.slice(longWindow - 1)
    };
}

module.exports = { runBacktest };
