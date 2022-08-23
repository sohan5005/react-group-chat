var net = require('net');
const fs = require('fs');

function getNetworkIP(callback) {
  var socket = net.createConnection(80, 'www.google.com');
  socket.on('connect', function() {
    callback(undefined, socket.address().address);
    socket.end();
  });
  socket.on('error', function(e) {
    callback(e, 'error');
  });
}

getNetworkIP(function (error, ip) {
  if (error) {
      console.error('error:', error);
  } else {
	fs.writeFileSync('./.env', `REACT_APP_SOCKET_IO_IP=${ip}`);
	console.log('IP:', ip);
  }
});