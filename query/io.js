const io = require('socket.io-client')

const uri = 'http://event-bus-srvc:4500'

const socket = io.connect(uri)

socket.on('connect', () => {
  console.log(`Query Server connected to Event-bus server on ${uri}: id`, socket.id)
})

socket.on('disconnect', () => {
  console.log(`Query Server disconnected from Event-bus server on ${uri}: id`, socket.id)
})

socket.on("connect_error", (err) => {
  console.log(`Query Server connect_error to Event-bus due to ${err.message}`);
});

module.exports = { socket }