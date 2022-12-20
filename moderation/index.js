const express = require('express')
const { socket } = require('./io')

const app = express()

app.use(express.json())

app.post('/events', (req, res) => {
  const event = req.body
  eventHandler(event)

  return res.status(200).json({ message: `Moderation server recieved event name ${event.type}` })
})

function eventHandler (event) {
  const modifiedEvent = { type: 'modifiedComment', data: {...event.data} }
  switch (event.type) {
    case 'CommentCreated':
      {
        if (event.data.content.toLowerCase().includes('orange')) {  
          modifiedEvent.data.status = 'rejected'
        } else {
          modifiedEvent.data.status = 'approved'
        }
        socket.emit('event', modifiedEvent)
      }  
    default:
      break
  }
}

app.listen(4300, () => {
  console.log('Moderation Server listening on port 4300')
})
