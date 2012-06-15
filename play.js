var io = require('socket.io');
var game = require('./game');

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

    var watchers = [];
    var currentGame = game.create();

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

    io.sockets.on('connection', function(socket) {
        socket.on('guess', function(rawData) {
          console.log('blyant: new guess ' + rawData);

          currentGame.guess(socket, rawData);

          var player = currentGame.getPlayer(socket);

          watchers.forEach( function(sock) {
            sock.emit('guess', {name : player.name, guess : player.guess});
          });
      })
      .on('draw', function(rawData) {
        console.log('blyant: new art ' + rawData);

        currentGame.draw(rawData);
        socket.broadcast.emit('draw', rawData);
      })
      .on('watcher', function() {
        console.log('blyant: new watcher!');

        currentGame.removePlayer(socket);
        addWatcher(socket);

        currentGame.getCommands().forEach(function (com) {
          socket.emit('draw', com);
        });

        currentGame.getPlayers().forEach(function (g) {
          socket.emit('guess', {name : g.name, guess : g.guess});
        });

        socket.emit('currentPlayer', currentGame.getDrawerName());
      })
      .on('player', function(name) {
        console.log('blyant: new player! ' + name);

        removeWatcher(socket);
        currentGame.addPlayer(socket, name);
      })
      .on('close', function() {
        console.log('blyant: connection closed');

        removeWatcher(socket);
        currentGame.removePlayer(socket);
      });
    });
  }
}

  module.exports = playServer;
