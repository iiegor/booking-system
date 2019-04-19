const broker = require('./broker')

const port = process.env.PORT || 8081
broker.listen(port, () => {
  console.log(`> Broker listening at http://localhost:${port}`)
})
