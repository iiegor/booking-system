const { Client, logger, Variables } = require('camunda-external-task-client-js')
const email = require('../lib/email')

// configuration for the Client:
//  - 'baseUrl': url to the Process Engine
//  - 'logger': utility to automatically log important events
//  - 'asyncResponseTimeout': long polling timeout (then a new request will be issued)
const client = new Client({
  baseUrl: 'http://localhost:8080/engine-rest',
  use: logger,
  asyncResponseTimeout: 10000
})

// Example products
const products = [
  {
    id: 1,
    name: 'Pack 6 Green Fees',
    price: 220,
    stock: 10,
  },
  {
    id: 2,
    name: 'Pack 3 Green Fees',
    price: 128,
    stock: 1,
  },
]

const findProduct = (id) => products.find(product => product.id === id)

const checkAvailability = (id, quantity) => {
  const product = products.find(product => {
    return (product.id === id)
      && (product.stock >= quantity)
  })

  return !!product
}

client.subscribe('check-availability', async ({ task, taskService }) => {
  // Business logic here
  const productId = task.variables.get('productId')
  const quantity = task.variables.get('quantity')

  const date = new Date()

  const isAvailable = checkAvailability(productId, quantity)
  const variables = new Variables().setAll({
    available: isAvailable,
    date,
  })

  // Complete the task & store variables in the process scope
  await taskService.complete(task, variables)
})

client.subscribe('send-email', async ({ task, taskService }) => {
  // Business logic here
  const productId = task.variables.get('productId')
  const available = task.variables.get('available')
  const quantity = task.variables.get('quantity')
  
  if (available) {

    // send information about the request product
  } else {

    // inform about the status and contact details for future
    const product = findProduct(productId)
    
    email.send({
      to: 'dextrackmedia@gmail.com',
      from: 'dextrackmedia@gmail.com',
      subject: 'Information about a requested product',
      text: `We're sorry but <strong>${product.name} (${quantity})</strong> is currently unavailable.`,
      html: `We're sorry but <strong>${product.name} (${quantity})</strong> is currently unavailable.`,
    }).then(() => {
      console.log('> Unavailable email sent!')
    })
  }

  // Complete the task
  await taskService.complete(task)
})
