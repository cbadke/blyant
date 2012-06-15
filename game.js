var game = {
  create : function () {

    that = new Object();

    var observers = [];
    var players = [];
    var commands = [];
    var currentPlayer = null;

    var playerIndexOf = function (id) {
      var idx = -1;
      for (player in players) {
        if (players[player].id === id) {
          idx = player;
        }
      }

      return idx;
    }

    that.getCommands = function () {
      return commands.slice(0);
    }

    that.getPlayers = function () {
      return players.slice(0);
    }

    that.getPlayer = function (id) {
      var index = playerIndexOf(id);

      if (index !== -1) {
        return players[index];
      }
      

    }

    that.getDrawerName = function () {
      var index = playerIndexOf(currentPlayer);

      if (index !== -1) {
        return players[index].name;
      }
      
    }

    that.addPlayer = function (id, name) {
      players.push( { id : id, name : name, guess : '' } );

      if (currentPlayer === null && players.length > 1) {
        currentPlayer = players[0];
      }
    }

    that.removePlayer = function (id) {
      var index = playerIndexOf(id);
      if (index !== -1) {
        players.splice(index, 1);
      }
    }

    that.guess = function (id, guess) {
      var index = playerIndexOf(id);
      if (index !== -1) {
        players[index].guess = guess;
      }
    }

    that.draw = function (drawCommand) {
      commands.push(drawCommand);
    }

    that.removeObserver = function (obs) {
      var index = observers.indexOf(obs);
      if (index !== -1) {
        observers.splice(index, 1);
      }
    }

    that.registerObserver = function (obs) {
      that.removeObserver(obs);
      observers.push(obs);
    }

    return that;
  }
}

module.exports = game;
