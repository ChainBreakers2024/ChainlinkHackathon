// websocket.js

const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

const exrooms = [
  {
    id: 1,
    name: "Room 1",
    game: "headtails",
    users: [1, 2, 3],
  },
  {
    id: 2,
    name: "Room 2",
    game: "roulette",
    users: [4, 5],
  },
];

let exusers = ["Alice", "Bob", "Charlie", "David", "Eve", "Frank"];

const rooms = [
  {
  id: "002cfa6a-8e25-4a0b-9af2-a112cb43c49f",
  game: "roulette",
  name: "Room 1",
  users: [1, 2, 3],
},
{
  id: "f40ca429-f9ee-4e2c-9bfa-e77679c140ab",
  game: "roulette",
  name: "Room 2",
  users: [4, 5],
},
]
let users = [  

]

function uuidV4() {
  const uuid = new Array(36);
  for (let i = 0; i < 36; i++) {
    uuid[i] = Math.floor(Math.random() * 16);
  }
  uuid[14] = 4; // set bits 12-15 of time-high-and-version to 0100
  uuid[19] = uuid[19] &= ~(1 << 2); // set bit 6 of clock-seq-and-reserved to zero
  uuid[19] = uuid[19] |= (1 << 3); // set bit 7 of clock-seq-and-reserved to one
  uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
  return uuid.map((x) => x.toString(16)).join('');
}

function newRoom(roomName, game) {
  let uuid = uuidV4()
  const newRoom = {
    id: uuid,
    game: game,
    name: roomName,
    users: [],
  };
  rooms.push(newRoom);
  return newRoom;
}

// Yeni kullanıcı ekleme fonksiyonu
function newUser(userName) {
  users.push(userName);
  return userName;
}

// Kullanıcıyı odaya ekleme fonksiyonu
function joinRoom(userName, roomId) {
  const room = rooms.find(room => room.id === roomId);
  if (room) {
    if (!room.users.includes(userName)) {
      room.users.push(userName);
    }
  }
}

function listRooms() {
  return rooms.map(room => {
    return {
      roomName: room.name,
      game: room.game,
      roomId: room.id,
      userCount: room.users.length,
    };
  });
}

// Kullanıcıyı odadan çıkarma fonksiyonu
function leaveRoom(userName, roomId) {
  const room = rooms.find(room => room.id === roomId);
  if (room) {
    room.users = room.users.filter(user => user !== userName);
  }
}

function getRoomDetails(roomId) {
  const room = rooms.find(room => room.id === roomId);
  const userList = room.users.map(userId => {
    const user = users.find(u => u.id === userId);
    return user ? user.name : `${userId}`;
  });

  return {
    roomName: room.name,
    roomId: roomId,
    game: room.game, // Oyunun adı buraya gelmeli
    users: userList,
    userCount: room.users.length,
  };
}

function getUserDetails(user) {
  const userRooms = rooms.filter(room => room.users.includes(user.name)).map(room => room.name);

  return {
    userName: user.name,
    // Diğer kullanıcı detayları buraya eklenebilir
  };
}

wss.on('connection', (ws) => {
  console.log("A client has connected.")
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
}
  });
  
  ws.on('message', (data) => {
    let sec = data.toString().split("_")
    if (sec[0] == "get") {
      if (sec[1] == "lobiler") {
        wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(sec[1] + "_" + JSON.stringify(listRooms()));
          }
        });
      } if (sec[1] == "lobi") {
        
      }
    }

  });
});

console.log('WebSocket server started on port 8080');