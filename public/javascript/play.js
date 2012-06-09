var socket = io.connect('http://localhost');

$(document).ready(function() {

  $('#guess').bind('keyup change paste cut', function(){
    socket.emit('guess', this.value);
  });


  startCanvas('#playCanvas', function() {
    socket.emit('draw', 'drawing changed ' + (new Date().getTime()));
  });
});
