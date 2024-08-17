// Calculate the moving average for a given window
function calculateMovingAverage(data, windowSize) {
    return data.map((_, index, array) => {
        if (index < windowSize) return null; // Not enough data for this window
        const window = array.slice(index - windowSize, index);
        const sum = window.reduce((acc, cur) => acc + cur.close, 0);
        return sum / windowSize;
    });
}

// Simulate a moving average crossover strategy
function movingAverageCrossover(data, shortWindow, longWindow) {
    const shortMA = calculateMovingAverage(data, shortWindow);
    const longMA = calculateMovingAverage(data, longWindow);

    let position = null; // null = no position, 'buy' = bought
    let entryPrice = 0;
    let profit = 0;
    
    // Array to store trades
    const trades = [];

    for (let i = longWindow; i < data.length; i++) {
        if (shortMA[i] > longMA[i] && !position) {
            // Buy signal
            position = 'buy';
            entryPrice = data[i].close;
            trades.push({ date: data[i].time, type: 'BUY', price: entryPrice });
        } else if (shortMA[i] < longMA[i] && position === 'buy') {
            // Sell signal
            position = null;
            const exitPrice = data[i].close;
            profit += exitPrice - entryPrice;
            trades.push({ date: data[i].time, type: 'SELL', price: exitPrice });
        }
    }

    return {
        profit,
        trades,
    };
}

module.exports = { movingAverageCrossover };
