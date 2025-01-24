const express = require('express');
const logger = require('./logger');
const cors = require('cors');
const helmet = require('helmet');

const pino = require('pino-http')({
    logger,
})

const app = express();

app.use(helmet());

app.use(cors());

app.use(pino);

app.use('/', (req, res) => {
    logger.info("Home");
    res.status(200).json("Hello World");
})
app.use('/hello', (req, res) => {
    res.status(200).send("hello");
})

module.exports = app