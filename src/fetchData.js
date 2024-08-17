const axios = require('axios');
require('dotenv').config();
const fs = require('fs');
const path = require('path');

const fetchHistoricalData = async (symbol, limit = 1000) => {
  try {
    const response = await axios.get(`https://min-api.cryptocompare.com/data/v2/histoday`, {
      params: {
        fsym: symbol,
        tsym: 'USD',
        limit: limit,
        api_key: process.env.CRYPTOCOMPARE_API_KEY,
      },
    });

    const data = response.data.Data.Data;

    // Save the data to a JSON file
    const filePath = path.join(__dirname, `../data/${symbol}_historical_data.json`);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    console.log(`Historical data for ${symbol} saved to ${filePath}`);
  } catch (error) {
    console.error(`Error fetching historical data for ${symbol}:`, error.message);
  }
};

module.exports = { fetchHistoricalData };
