const env = require('dotenv').config({path: __dirname + '/.env'});
const { createServer } = require('http');
const { Server } = require('socket.io');
const tests = [
  {
    test: 'ZnVja3xmdVtXfF98MC05XWt8ZltXfF98MC05XWNrfFtXfF98MC05XXVja3xmdWNbV3xffDAtOV18ZltXfF98MC05XVtXfF98MC05XWt8ZltXfF98MC05XWs=',
    say: 'SSBoYXZlIHVzZWQgdGhlIEYgd29yZCwgaXQncyBhIGJhZCB0aGluZy4gSSBzZWVrIGZvcmdpdmVuZXNzIGZyb20gZ29k'
  }
];
const HISTORY = [];

const atob = i => Buffer.from(i, 'base' + (2**6)).toString('utf8');

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

  socket.emit('history', HISTORY);

  socket.on('disconnect', reason => {
    console.log(`disconnect ${socket.id} due to ${reason}`);
  });

  socket.on('message', data => {
    const { from } = data;
    console.log(`Message Recieved from ${from}`);

    io.emit('broadcast', data);
    HISTORY.push(data);

    tests.forEach(({test, say}) => {
      const regx = new RegExp( atob(test), 'gi' );
      if( regx.test(data.data) ) {
        let time = data.time;
        time++;
        let casting = {...data, time, data: atob(say)};

        io.emit('broadcast', casting);
        HISTORY.push(casting);

        time++;
        casting = {...data, data: data.from, time, type: 'ban'}
        
        io.emit('broadcast', casting);
        HISTORY.push(casting);
      }
    });
  });
});
console.log('Starting Server at: ', ip || 'localhost');
httpServer.listen(1000, ip || 'localhost');
