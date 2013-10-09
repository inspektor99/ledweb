var Ledstrip = {
  io: null,
  clientSocket: null,
  setServer: function(server) {
    Ledstrip.io = require('socket.io').listen(server);
    server.listen(80);

    Ledstrip.io.sockets.on('connection', function(socket) {
      Ledstrip.clientSocket = socket;
    });
  },
  changeAll: function(color) {
    var leds = [];

    var i = 0;
    for (i = 0; i < 25; i++) {
      leds.push(color);
    }
    Ledstrip.clientSocket.emit('updateLeds', {
      leds: leds
    });
  },
};

exports.setServer = Ledstrip.setServer;

exports.changeAll = Ledstrip.changeAll;