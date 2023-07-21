// socket.js
const socketIO = require('socket.io');

let io;

function setupSocket(server) {
  io = socketIO(server);

  io.on('connection', (socket) => {
    console.log('A client connected.');

    // Handle events from the client (if needed)
    // socket.on('eventName', (data) => {
    //   // Do something with the data
    // });

    // Handle disconnection (optional)
    socket.on('disconnect', () => {
      console.log('A client disconnected.');
    });
  });
}

function getIO() {
  return io;
}

module.exports = {
  setupSocket,
  getIO,
};
