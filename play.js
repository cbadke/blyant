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
    var players = [];

    var addWatcher = function (w) {
      watchers.push(w);
    }

    var removeWatcher = function (w) {
        var i = watchers.indexOf(w);
        if(i != -1) {
          console.log('watcher left');
          sockets.splice(i,1);
       }
    }

    var addPlayer = function (p, name) {
        players.push( { sock : p, name : name } );
    }

    var removePlayer = function (p) {
        var pIndex = -1;
        for (player in players) {
          if (players[player].sock === p) {
            players.splice(player, 1);
          }
        }
    }

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

        removePlayer(socket);
        addWatcher(socket);
      })
      .on('player', function(name) {
        console.log('blyant: new player! ' + name);

        removeWatcher(socket);
        addPlayer(socket, name);
      })
      .on('close', function() {
        console.log('blyant: connection closed');

        removeWatcher(socket);
        removePlayer(socket);
      });
    });
  }
}

  module.exports = playServer;
