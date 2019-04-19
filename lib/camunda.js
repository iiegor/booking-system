const { Client, logger } = require('camunda-external-task-client-js')

// configuration for the Client:
//  - 'baseUrl': url to the Process Engine
//  - 'logger': utility to automatically log important events
//  - 'asyncResponseTimeout': long polling timeout (then a new request will be issued)
const client = new Client({
  baseUrl: 'http://localhost:8080/engine-rest',
  use: logger,
  autoPoll: true,
  asyncResponseTimeout: 10000,
})

module.exports = client
