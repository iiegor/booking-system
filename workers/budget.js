const { logger, Variables } = require('camunda-external-task-client-js')
const camunda = require('../lib/camunda')
const email = require('../lib/email')
const db = require('../lib/db')

// Example products
const findProduct = (id) => db.getProducts().find(product => product.id === id)

camunda.subscribe('calculate-budget', async ({ task, taskService }) => {
  // Business logic here
  console.log('Calculating estimated budget...')

  const productId = task.variables.get('productId')
  const quantity = task.variables.get('quantity')

  const product = findProduct(productId)

  email.send({
    to: 'dextrackmedia@gmail.com',
    subject: `Here is your budget for ${product.name} (x${quantity})`,
    text: `<strong>${product.name} (x${quantity})</strong> will be yours for only <strong>${product.price} €</strong>`,
    html: `<strong>${product.name} (x${quantity})</strong> will be yours for only <strong>${product.price} €</strong>`,
  }).then(() => {
    console.log('> Budget email sent!')
  })

  // Complete the task
  await taskService.complete(task)
})
