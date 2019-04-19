const sendgrid = require('@sendgrid/mail')
const config = require('../config')

sendgrid.setApiKey(config.sendgrid.apiKey)

module.exports = {
  send (opts) {
    opts = Object.assign({ from: config.sendgrid.from }, opts)

    return sendgrid.send(opts)
  }
}
