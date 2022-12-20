const express = require('express');
const { randomBytes } = require('crypto')
const cors = require('cors')
const { socket } = require('./io')

const commentsByPostId = {}

const app = express()
app.use(cors())
app.use(express.json());

app.get('/post/:id/comments', (req, res) => {
  const comments = commentsByPostId[req.params.id] || []
  
  return res.status(200).json(comments)
})

app.post('/post/:id/comments', async(req, res) => {
  const id = randomBytes(4).toString('hex')
  const { content  } = req.body
  let comments = commentsByPostId[req.params.id] ||  []

  comments.push({
    id,
    content,
    status: 'pending'
  })
  commentsByPostId[req.params.id] = comments
  const newEvent = {
    type: 'CommentCreated',
      data: {
        ...comments[comments.length -1],
        postId: req.params.id,
      }
  }

  socket.emit('event', newEvent)

  return res.status(201).json(commentsByPostId[req.params.id])
})

app.post('/events', async (req, res) => {
  const event = req.body
  eventHandler(event)

  return res.status(200).json({message: `Comment server recieved event name ${event.type}`})
 
})

app.listen(4100,() => {
    console.log('Comment Server Listening on port 4100')
})

function eventHandler(event) {
  switch (event.type) {
    case 'modifiedComment':
      {
        post = commentsByPostId[event.data.postId].find(post => post.id === event.data.id)
        post = event.data
        console.log('commentsByPostId', commentsByPostId)
        console.log('updatedComment', event.data)
        socket.emit('event', {
          type: 'updatedComment',
          data: {
            ...post
          }
        })
      }
      
    default:
      break
  }
}