const { Variables } = require('camunda-external-task-client-js')
const camunda = require('../lib/camunda')
const email = require('../lib/email')
const db = require('../lib/db')

const findProduct = (id) => db.getProducts().find(product => product.id === id)

const checkAvailability = (id, quantity) => {
  const product = db.getProducts().find(product => {
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
  
  const product = findProduct(productId)

  if (available) {

    // send information about the requested product
    email.send({
      to: 'dextrackmedia@gmail.com',
      subject: `We're working on your budget`,
      text: `Congrats! <strong>${product.name} (x${quantity})</strong> is scheduled for an estimated budget by our agents.`,
      html: `Congrats! <strong>${product.name} (x${quantity})</strong> is scheduled for an estimated budget by our agents.`,
    }).then(() => {
      console.log('> Available email sent!')
    })
  } else {

    // inform about the status and contact details for future    
    email.send({
      to: 'dextrackmedia@gmail.com',
      subject: 'Information about the requested product',
      text: `We're sorry but <strong>${product.name} (x${quantity})</strong> is currently unavailable.`,
      html: `We're sorry but <strong>${product.name} (x${quantity})</strong> is currently unavailable.`,
    }).then(() => {
      console.log('> Unavailable email sent!')
    })
  }

  // Complete the task
  await taskService.complete(task)
})
