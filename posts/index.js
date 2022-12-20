const express = require('express')
const { randomBytes } = require('crypto')
const cors = require('cors')
const { socket } = require('./io')

const posts = {}

const app = express()
app.use(cors())
app.use(express.json())

app.post('/post/create', async (req, res) => {
  console.log('Post server: in app.post post/create')
  const id = randomBytes(4).toString('hex')
  const { title } = req.body

  posts[id] = { id, title }
  
  console.log('creating post')
  const event = {
    type: 'PostCreated',
    data: { id, title}
  }

  // outgoing event 
  socket.emit('event', event)

  return res.status(201).json(posts[id])
})

// incoming event
app.post('/events', (req, res) => {
  try {
    const event = req.body
    return res.status(200).json({message: `post server recieved event name ${event.type}`})
  } catch (err){
    err.message = 'Post Server Error: ' + err.message
    return res.status(500).json({message: err.message})
  }
})

app.listen(4000, () => {
  console.log('Post Server listening on port 4000')
})
