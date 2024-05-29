// socket.js
const socketIo = require('socket.io');
let io;

const init = (server) => {
  io = socketIo(server);
  return io;
};

const getIo = () => {
  if (!io) {
    throw new Error('Socket.io not initialized!');
  }
  return io;
};

module.exports = {
  init,
  getIo,
};
