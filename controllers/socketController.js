const { getIo } = require('../socket');

exports.handleSocket = (socket) => {
  console.log('New client connected');


  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
};
