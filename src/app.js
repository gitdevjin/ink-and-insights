const express = require('express');
const app = express();
const logger = require('./logger');

const pino = require('pino-http')({
    logger,
})

app.use(pino);

app.use('/', (req, res) => {
    logger.info("Home");
    res.status(200).json("Hello World");
})
app.use('/hello', (req, res) => {
    res.status(200).send("hello");
})

module.exports = app