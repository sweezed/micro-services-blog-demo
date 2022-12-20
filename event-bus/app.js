const axios = require('axios')
const express = require('express')
const app = express()

app.use(express.json())

const events = []

// app.post('/event', async (req, res) => {
//   const event = req.body
//   events.push(event)

//   console.log('EventBust:Recieved event:', event)
  

//   return res.status(201).json({message: 'ok'})
// })

app.get('/events', (req, res) => {
  return res.send(events)
})

async function sendEvents(event) {
  const responses = await Promise.allSettled([
    axios.post('http://posts-cluster-ip-srvc:4000/events', event).catch(err => {throw axiosErrorHandler(err)}),
    axios.post('http://comments-cluster-ip-srvc:4100/events', event).catch(err => {throw axiosErrorHandler(err)}),
    axios.post('http://query-cluster-ip-srvc:4200/events', event).catch(err => {throw axiosErrorHandler(err)}),
    axios.post('http://moderation-cluster-ip-srvc:4300/events', event).catch(err => {throw axiosErrorHandler(err)}),
  ])
  responsesHandler(responses)
  console.log('\n')
}

function axiosErrorHandler (error) {
  if (error.response) {
    return {
      status: error.response.status,
      message: error.response.data.message
    }
  }

  return error
}

function responsesHandler(responses) {
  for (const response of responses) {
    // Error
    if (response.reason) {
      console.log(`   status: ${response.reason.status}, message: ${response.reason.message}`)
    }

    if (response.value) {
      console.log(`   ${response.value.data.message}`)
    }
  }
}

module.exports = {
  app,
  sendEvents
}