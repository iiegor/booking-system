const { logger, Variables } = require('camunda-external-task-client-js')
const camunda = require('../lib/camunda')
const email = require('../lib/email')

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

camunda.subscribe('check-availability', async ({ task, taskService }) => {
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

camunda.subscribe('send-email', async ({ task, taskService }) => {
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
