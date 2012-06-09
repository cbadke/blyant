var socket = io.connect('http://localhost');

$(document).ready(function() {

  $('#guess').bind("keyup change paste cut", function(){
    socket.emit('guess', this.value);
  });

});
