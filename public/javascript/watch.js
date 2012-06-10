
var socket = io.connect('http://localhost');
socket.emit('watcher');

var display;

socket.on('guess', function(rawData) {
  console.log('new guess ' + rawData);

  $('#guesses').html('<ul>'+rawData+'</ul>');
})
.on('draw', function(rawData) {
  if(display) {
    display.update(rawData);
  }
})
.on('close', function() {
  console.log('connection closed');
});

$(document).ready(function () {
  display = new DrawCanvas('#playCanvas').setActive(false);  
});
