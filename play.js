var ws = require('websocket.io');


var playServer = {

  start : function (server) {
    console.log('Attaching playServer socket....');
    ws.attach(server).on('connection', function(socket) {
//      socket.send('Welcome to Guess-a-sketch');

      socket.on('message', function(rawData) {
        console.log('new message ' + rawData);
        socket.send('thanks for the text');
      })
      .on('close', function() {
        console.log('connection closed');
      });
    });
  }
}

  module.exports = playServer;
