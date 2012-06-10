var io = require('socket.io');

var playServer = {

  start : function (server) {

    console.log('blyant: Attaching playServer socket....');
    io = io.listen(server);
  
    if (process.env.PLATFORM === "heroku") {
      io.configure(function () { 
        console.log("blyant: forcing long polling...");

          io.set("transports", ["xhr-polling"]); 
            io.set("polling duration", 10); 
      });
    }

    var commands = [];
    var watchers = [];

    io.sockets.on('connection', function(socket) {

      commands.forEach(function (com) {
        socket.emit('draw', com);
      });

      socket.on('guess', function(rawData) {
        console.log('blyant: new guess ' + rawData);

        watchers.forEach( function(sock) {
          sock.emit('guess', rawData);
        });
      })
      .on('draw', function(rawData) {
        console.log('blyant: new art ' + rawData);

        commands.push(rawData);
        socket.broadcast.emit('draw', rawData);
      })
      .on('watcher', function() {
        console.log('blyant: new watcher!');
        watchers.push(socket);
      })
      .on('player', function(name) {
        console.log('blyant: new player! ' + name);
      })
      .on('close', function() {
        console.log('blyant: connection closed');

        var i = watchers.indexOf(socket);
        if(i != -1) {
          console.log('watcher left');
          sockets.splice(i,1);
        }
      });
    });
  }
}

  module.exports = playServer;
