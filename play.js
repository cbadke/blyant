var io = require('socket.io');

var playServer = {

  start : function (server) {

    console.log('Attaching playServer socket....');
    io = io.listen(server);

    io.sockets.on('connection', function(socket) {

      socket.on('guess', function(rawData) {
        console.log('new guess ' + rawData);
        socket.broadcast.emit('guess', rawData);
      })
      .on('draw', function(rawData) {
      
        console.log('new art ' + rawData);
      
        socket.broadcast.emit('draw', rawData);
      })
      .on('close', function() {
        console.log('connection closed');
      });
    });
  }
}

  module.exports = playServer;
