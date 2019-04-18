const productAvailability = require('./workers/product-availability')
const broker = require('./broker')

const port = process.env.PORT || 8081
broker.listen(port, () => {
  console.log(`> Broker listing at http://localhost:${port}`)
})