const env = require('dotenv').config({path: __dirname + '/.env'});
const { createServer } = require('http');
const { Server } = require('socket.io');

const ip = env.parsed.REACT_APP_SOCKET_IO_IP;
const port = "3000";
const hosts = ["http://localhost:" + port];
if( ip ) {
  hosts.push( `http://${ip}:${port}` );
} else {
  console.log('Server could not start. Environment file not found!!!');
}

const httpServer = createServer((req, res) => {
  if (req.url === '/ip') {
    res.writeHead(200);
    res.end(ip);
    return;
  }
  if (req.url !== '/') {
    res.writeHead(404);
    res.end('Not found');
    return;
  }
});

const io = new Server(httpServer, {
  cors: {
    origin: hosts,
  }
});

io.on('connection', socket => {
  console.log(`connect ${socket.id}`);

  socket.on('disconnect', reason => {
    console.log(`disconnect ${socket.id} due to ${reason}`);
  });

  socket.on('message', data => {
    const { from } = data;
    console.log(`Message Recieved from ${from}`);

    io.emit('broadcast', data);
  });
});
console.log('Starting Server at: ', ip || 'localhost');
httpServer.listen(1000, ip || 'localhost');
