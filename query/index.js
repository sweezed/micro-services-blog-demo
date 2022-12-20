const express = require('express')
const cors = require('cors')
const { socket } = require('./io')

const posts = {}

const app = express()
app.use(cors())
app.use(express.json())

app.get('/posts', (req, res) => {
  console.log('Query Server: returning POSTS')
  return res.status(200).json(posts)
})

app.post('/events', (req, res) => {
  try {
    const event = req.body
    eventHandler(event)
    return res
      .status(200)
      .json({ message: `Query server recieved event name ${event.type}` })
  } catch (err) {
    err.message = 'Query Server Error: ' + err.message
    return res.status(500).json({ message: err.message })
  }
})

app.listen(4200, async () => {
  console.log(' Query Server listening on port 4200')
})

function eventHandler (event) {
  switch (event.type) {
    case 'PostCreated':
      {
        posts[event.data.id] = {...event.data, comments: []}
        socket.emit('event', {type: 'queryPostSrvc', data: {}})
      }
      break
    case 'CommentCreated':
      {
        posts[event.data.postId].comments.push(event.data)
        socket.emit('event', {type: 'queryPostSrvc', data: {}})
      }
      break
    case 'updatedComment': {
      const post = posts[event.data.postId]
      const comment = post.comments.find(comment => comment.id === event.data.id)
      comment.status = event.data.status
      comment.id = event.data.id
      comment.contents  = event.data.contents
      comment.postId = event.data.postId
      console.log('posts', posts)
      console.log('event.data', event.data)
      socket.emit('event', {type: 'queryPostSrvc', data: {}})
    }

    default:
      break
  }
}
