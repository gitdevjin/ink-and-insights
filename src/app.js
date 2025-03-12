const express = require('express');
const logger = require('./logger');
const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');
const cookieParser = require('cookie-parser');

const pino = require('pino-http')({
  logger,
});

const app = express();

app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

app.use(
  cors({
    origin: 'http://localhost:5173', // ✅ Explicitly allow your frontend URL
    credentials: true, // ✅ Allow cookies to be sent/received
  })
);

app.use(compression());

app.use(pino);

// Parsers
app.use(express.json());
app.use(cookieParser());

// routers for our app
app.use('/', require('./routes'));

// 404 middleware to handle any requests for resources that can't be found
app.use((req, res) => {
  res.status(404).json('not found');
});

// Add error-handling middleware to deal with anything else
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  // We may already have an error response we can use, but if not,
  // use a generic `500` server error and message.
  const status = err.status || 500;
  const message = err.message || 'unable to process request';

  // If this is a server error, log something so we can see what's going on.
  if (status > 499) {
    logger.error({ err }, `Error processing request`);
  }

  res.status(status).json(message);
});

module.exports = app;
