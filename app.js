var connect = require('connect');

var server = connect();

var port = process.env.PORT || 8000;

console.log("Starting server on port " + port + "...");

server.use(connect.logger())
      .use(connect.static(__dirname + '/public'))
      .listen(process.env.PORT || 8000);
