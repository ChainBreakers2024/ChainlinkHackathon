// websocket.js

const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

const users = [];
const head = [];
const tails = [];

wss.on('connection', (ws) => {
  console.log("A client connected")
  ws.on('message', (data) => {
    if (data.toString().split("_")[0] == "head") {
      head.push(data.toString());
    } if (data.toString().split("_")[0] == "tails") {
      tails.push(data.toString());
    }
    users.push(data.toString());
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(head));
        client.send(JSON.stringify(tails));
      }
    });
  });
});

console.log('WebSocket server started on port 8080');