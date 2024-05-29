
const http = require('http');
const app = require('./app');
const { init } = require('./socket');
const { handleSocket } = require('./controllers/socketController');

const server = http.createServer(app);
const io = init(server);

io.on('connection', handleSocket);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

