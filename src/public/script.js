document.addEventListener('DOMContentLoaded', async function() {
    console.log('Script is loaded.');

    // Fetch the backtest data from the server
    try {
        const response = await fetch('/backtest/BTC?shortWindow=10&longWindow=50');
        const data = await response.json();

        // Extract the moving averages and labels
        const labels = data.data.map((_, index) => `Day ${index + 1}`);
        const shortMovingAverage = data.shortMovingAverage;
        const longMovingAverage = data.longMovingAverage;

        // Create the chart
        const ctx = document.getElementById('cryptoChart').getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Short Moving Average',
                        data: shortMovingAverage,
                        borderColor: 'rgba(75, 192, 192, 1)',
                        fill: false
                    },
                    {
                        label: 'Long Moving Average',
                        data: longMovingAverage,
                        borderColor: 'rgba(153, 102, 255, 1)',
                        fill: false
                    }
                ]
            },
            options: {
                responsive: true,
                title: {
                    display: true,
                    text: 'BTC Backtest Results'
                }
            }
        });
    } catch (error) {
        console.error('Error fetching backtest data:', error);
    }
});
