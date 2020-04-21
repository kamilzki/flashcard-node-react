const axios = require('axios');
require('dotenv').config();

exports.axiosPons = axios.create({
  baseURL: 'https://api.pons.com/v1',
  headers: {'X-Secret': process.env.PONS_SECRET}
});
