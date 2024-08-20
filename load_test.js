const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');

const URL = 'http://localhost:5000/resize';  // Replace with your server's URL if running on AWS
const FILE_PATH = 'uploads/qwert.jpg';  // Replace with the path to a test image in the uploads directory
const concurrency = 50;  // Number of concurrent requests
const duration = 5 * 60 * 1000;  // Duration of test in milliseconds (5 minutes)

async function sendRequest() {
  try {
    const form = new FormData();
    form.append('image', fs.createReadStream(FILE_PATH));

    const response = await axios.post(URL, form, {
      headers: form.getHeaders(),
    });

    console.log('Response:', response.data);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

async function loadTest() {
  const startTime = Date.now();

  while (Date.now() - startTime < duration) {
    const requests = [];

    for (let i = 0; i < concurrency; i++) {
      requests.push(sendRequest());
    }

    await Promise.all(requests);
  }

  console.log('Load test completed.');
}

loadTest();
