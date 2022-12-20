import { io } from 'socket.io-client'

const socket = io('http://posts.com/', {
  path: '/socket.io',
  transports: ["websocket"]
})

socket.on('connect', () => {
  console.log('client connected to server on 5000: id', socket.id)
})


socket.on('disconnect', () => {
  console.log('client disconnected from server on 5000: id', socket.id)
})

socket.on("connect_error", (err) => {
  console.log(`client connect_error due to ${err.message}`);
});

export { socket }