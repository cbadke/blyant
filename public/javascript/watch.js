
var socket = io.connect('http://localhost');

socket.on('guess', function(rawData) {
  console.log('new guess ' + rawData);

  $('#guesses').html('<ul>'+rawData+'</ul>');
})
.on('close', function() {
  console.log('connection closed');
});
