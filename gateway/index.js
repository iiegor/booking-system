const express = require('express')
const { needsAuthorization } = require('./middlewares/auth')
const camundaRoute = require('./routes/camunda')

const app = express()
app.disable('x-powered-by')

// Internal API
app.use('/_', needsAuthorization, camundaRoute())

// Health route
app.get('/', (req, res) => res.sendStatus(200))

const port = process.env.PORT || 8081
app.listen(port, () => {
  console.log(`> API Gateway started at http://localhost:${port}`)
})

