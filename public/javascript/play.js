var socket = io.connect('http://localhost');
socket.emit('player', new Date());

var drawCanvas;

$(document).ready(function() {

  $('#guess').bind('keyup change paste cut', function(){
    socket.emit('guess', this.value);
  });


  drawCanvas = new DrawCanvas('#playCanvas').onChange(function(canvasData) {
    socket.emit('draw', canvasData);
  });
});
