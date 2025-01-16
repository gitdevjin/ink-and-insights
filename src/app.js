const express = require('express');
const app = express();
const logger = require('./logger');

app.use('/', (req, res) => {
    res.status(200).json("Hello World");
})
app.use('/hello', (req, res) => {
    res.status(200).send("hello");
})

module.exports = app