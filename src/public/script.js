document.addEventListener('DOMContentLoaded', async function() {
    console.log('Script is loaded.');

    // Fetch the backtest data from the server
    try {
        const response = await fetch('/backtest?symbols=BTC,ETH,LTC&shortWindow=10&longWindow=50');
        const data = await response.json();

        // Log the data to see its structure
        console.log('Backtest data:', data);

        // Access the results array inside the data object
        const results = data.results;

        // Ensure results is an array
        if (!Array.isArray(results)) {
            throw new Error('Results is not an array');
        }

        // Prepare datasets for Chart.js
        const datasets = results.map(result => ({
            label: `${result.symbol} - Short Moving Average`,
            data: result.backtestResult.shortMovingAverage,
            borderColor: getRandomColor(),
            fill: false
        }));

        const labels = results[0].backtestResult.data.map((_, index) => `Day ${index + 1}`);

        // Create the chart
        const ctx = document.getElementById('cryptoChart').getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: datasets
            },
            options: {
                responsive: true,
                title: {
                    display: true,
                    text: 'Crypto Backtest Results'
                }
            }
        });
    } catch (error) {
        console.error('Error fetching backtest data:', error);
    }
});

// Function to generate random colors for the chart lines
function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
