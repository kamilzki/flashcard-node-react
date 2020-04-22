const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const translationRoutes = require('./routes/translation');

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    '*'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.use('/auth', authRoutes);
app.use('/translation', translationRoutes);

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({message: message, data: data});
});

mongoose.connect(process.env.MONGODB)
  .then(_ => {
    app.listen(process.env.PORT);
  })
  .catch(err => console.log(err));

module.exports = app;
