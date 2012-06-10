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


    io.sockets.on('connection', function(socket) {

      socket.on('guess', function(rawData) {
        console.log('blyant: new guess ' + rawData);
        socket.broadcast.emit('guess', rawData);
      })
      .on('draw', function(rawData) {

        console.log('blyant: new art ' + rawData);

        socket.broadcast.emit('draw', rawData);
      })
      .on('close', function() {
        console.log('blyant: connection closed');
      });
    });
  }
}

  module.exports = playServer;
