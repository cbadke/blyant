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
    var currentPlayer = null;
    var player1 = null;
    var player2 = null;

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

    var playerIndexOf = function (p) {
      var pIndex = -1;
      for (player in players) {
        if (players[player].sock === p) {
          pIndex = player;
        }
      }

      return pIndex;
    }

    var addPlayer = function (p, name) {
      players.push( { sock : p, name : name, guess : '' } );

      if (player1 === null) {
        player1 = p;
      } else if (player2 === null) {
        player2 = p;
      }
    }

    var removePlayer = function (p) {
      var pIndex = playerIndexOf(p);
      if (pIndex !== -1) {
        players.splice(pIndex, 1);
      }
    }

    var nextPlayer = function (socket) {
        
        if (currentPlayer !== player1) {
          currentPlayer = player1;
        } else {
          currentPlayer = player2;
        }

        if (currentPlayer !== null) {
          socket.emit('currentPlayer', players[playerIndexOf(currentPlayer)].name);
          socket.broadcast.emit('currentPlayer', players[playerIndexOf(currentPlayer)].name);
        }
    }

    io.sockets.on('connection', function(socket) {
      socket.on('guess', function(rawData) {
        console.log('blyant: new guess ' + rawData);

        var pIndex = playerIndexOf(socket);
        if (pIndex !== -1) {
          var player = players[pIndex];
          player.guess = rawData;

          watchers.forEach( function(sock) {
            sock.emit('guess', {name : player.name, guess : player.guess});
          });

          if (rawData === 'red') {
            nextPlayer(socket);
          }
        }
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

        commands.forEach(function (com) {
          socket.emit('draw', com);
        });

        players.forEach(function (g) {
          socket.emit('guess', {name : g.name, guess : g.guess});
        });

        socket.emit('currentPlayer', players[playerIndexOf(currentPlayer)].name);
      })
      .on('player', function(name) {
        console.log('blyant: new player! ' + name);

        removeWatcher(socket);
        addPlayer(socket, name);

        if (currentPlayer === null) {
          nextPlayer(socket);
        }

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
