const express = require('express')

const app = express()
app.disable('x-powered-by')

app.get('/', (req, res) => res.sendStatus(200))

module.exports = app
