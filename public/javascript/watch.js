
var socket = io.connect('http://localhost');
socket.emit('watcher');

var display;
var guesses = [];

var addGuess = function (guessData) {

  var idx = -1;

  for (i in guesses) {
    if (guesses[i].name === guessData.name) {
      idx = i;
      break;
    }
  }

  if (idx !== -1) {
    guesses[idx] = guessData;
  }
  else {
    guesses.push(guessData);
  }

}

socket.on('guess', function(rawData) {
  console.log('new guess ' + rawData);

  addGuess(rawData);
  var guessHtml = '';

  guesses.forEach( function (data) {
    guessHtml += '<ul>' + data.name + ' : ' + data.guess + '</ul>';
  });
  
  $('#guesses').html(guessHtml);
})
.on('draw', function(rawData) {
  if(display) {
    display.update(rawData);
  }
})
.on('currentPlayer', function (rawData) {
  $('#playerBanner').html(rawData);
})
.on('close', function() {
  console.log('connection closed');
});

$(document).ready(function () {
  display = new DrawCanvas('#playCanvas').setActive(false);  
});
