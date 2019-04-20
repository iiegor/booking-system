const express = require('express')
const axios = require('axios')

const camudaRest = axios.create({
  baseURL: 'http://localhost:8080/engine-rest',
})

module.exports = () => {
  const router = express.Router()
  
  router.get('/process-instance/:key?', (req, res) => {
    const { key } = req.params
    
    camudaRest.post('/process-instance', {
      'processDefinitionKey': key
    }).then(response => {
      res.json(response.data)
    })
  })
  
  router.get('/process-instance/:id/variables', (req, res) => {
    const { id } = req.params
    
    camudaRest.get(`/process-instance/${id}/variables`).then(response => {
      res.json(response.data)
    })
  })
  
  router.get('/tasks/:key?', (req, res) => {
    const { key } = req.params
  
    camudaRest.get('/task', {
      params: {
        'processDefinitionKey': key
      }
    }).then(response => {
      res.json(response.data)
    })
  })
  
  return router
}
