var ws = new WebSocket("ws://" +location.host);

  ws.onopen = function () {
        ws.send(JSON.stringify({type:"login",message:""}));
          };

  ws.onmessage = function (e) {
        console.log(e.data);
          };
