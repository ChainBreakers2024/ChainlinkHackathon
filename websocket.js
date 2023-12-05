// websocket.js

const { Server } = require("socket.io");
const http = require("http");

const server = http.createServer();
const io = new Server(server, {
  cors: {
    origin: "http://80.208.221.81:3000", // Replace with your frontend URL
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true,
  },
});

const rooms = [
  {
  id: "002cfa6a-8e25-4a0b-9af2-a112cb43c49f",
  game: "roulette",
  name: "Test Room 1",
  users: [],
},
{
  id: "f40ca429-f9ee-4e2c-9bfa-e77679c140ab",
  game: "roulette",
  name: "Test Room 2",
  users: [],
},
{
  id: "09e0cb99-a6b7-4a9e-a78c-6f24f4e17066",
  game: "headtails",
  name: "Test Room 31sj",
  users: [],
},
{
  id: "f2949e33-ff08-4f82-873c-241b034c1e82",
  game: "russianroulette",
  name: "Mental Breakdown Help",
  users: [],
},
]
let users = []

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
  if (!roomId) {return};
  const room = rooms.find(room => room.id === roomId);
  const userList = room.users.map(user => `${user.slice(0, 6)}...${user.slice(-4)}`);

  return {
    roomName: room.name,
    roomId: roomId,
    game: room.game, // Oyunun adı buraya gelmeli
    users: userList,
    userCount: room.users.length,
  };
}

function checkUser(userName) {
  return users.includes(userName);
}

function getUserDetails(userName) {
  const userRoom = rooms.find(room => room.users.includes(userName));
  return userRoom ? userRoom.id : false;
}

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("join_room", (data) => {
    if (checkUser() == false) {
      newUser(data.name)
    }
    if (getUserDetails(data.name)) {
      const old_room = getUserDetails(data.name)
      leaveRoom(data.name, old_room)
      socket.leave(old_room)
      socket.to(old_room).emit("get_room", getRoomDetails(old_room));
      socket.emit("get_room", getRoomDetails(old_room));
    }

    joinRoom(data.name, data.id)
    socket.join(data.id)
    socket.to(data.id).emit("get_room", getRoomDetails(data.id));
    socket.emit("get_room", getRoomDetails(data.id));
  });

  socket.on("leave_room", (data) => {
    leaveRoom(data.name, data.id)
    socket.leave(data.id)
    socket.to(data.id).emit("get_room", getRoomDetails(data.id));
    socket.emit("get_room", getRoomDetails(data.id));
  });

  socket.on("get_room", (data) => {
    socket.emit("get_room", getRoomDetails(data));
  });

  socket.on("get_userroom", (data) => {
    socket.emit("get_userroom", getUserDetails(data));
  });

  socket.on("get_rooms", (data) => {
    socket.emit("get_rooms", listRooms());
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
  });
});

server.listen(8080, () => {
  console.log("Socket.IO server started on port 8080");
});