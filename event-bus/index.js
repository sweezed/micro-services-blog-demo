const  { app, sendEvents } = require('./app')
const http = require('http')
const httpServer = http.createServer(app)

const { Server } = require('socket.io')
const io = new Server(httpServer, {
  path: "/socket.io",
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  }
})

io.on('connection', (socket) => {
  console.log('a user connected with an id of:', socket.id);
  socket.on('event', async newEvent => {
    console.log('event-bus: NEW EVENT recieved:', newEvent)
    const clients = await io.fetchSockets()
    const ids = clients.map(client => client.id)
    console.log('list of clients', ids)
    try {
      if (newEvent.type === 'queryPostSrvc') {
        // this is for React client
        console.log('Event bus subbmit new event to listeners', newEvent)
        socket.emit('client', newEvent)
      } else {
        // this is for http services
        await sendEvents(newEvent)
      }
    } catch (error) {
      console.log('error in sendEvents', error)
    }
  })
})

httpServer.listen(4500, () => {
  console.log('sockets listen on port 4500')
})

// Begin reading from stdin so the process does not exit.
process.stdin.resume();

process.on('SIGINT', async function (code) {
  console.log('SIGINT received...');
  io.emit('event', {msg: 'Disconnecting in 7'})
  await delay(7)
  io.disconnectSockets()
  httpServer.close();
});

async function delay (seconds) {
  seconds = seconds * 1000
  return new Promise(resolve => {
    setTimeout(resolve, seconds)
  })
}
