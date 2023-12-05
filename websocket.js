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
  owner: "",
  users: ["0xB5653117d7FE2Da50731B85c6fe53d3133828cf2","0xB5653117d7FE2Da50731B85c6fe53d3133828cf2","0xB5653117d7FE2Da50731B85c6fe53d3133828cf2","0xB5653117d7FE2Da50731B85c6fe53d3133828cf2","0xB5653117d7FE2Da50731B85c6fe53d3133828cf2","0xB5653117d7FE2Da50731B85c6fe53d3133828cf2","0xB5653117d7FE2Da50731B85c6fe53d3133828cf2","0xB5653117d7FE2Da50731B85c6fe53d3133828cf2"],
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

function createRandomRoomName() {
  const gamblingWords = ["Jackpot", "Bet", "Lucky", "Roller", "Casino", "Ace", "Poker", "Fortune"];
  const roomTypes = ["Room", "Lounge", "Suite", "Den", "Parlor", "Zone", "Hangout"];
  const numberSuffixes = ["101", "360", "5000", "777", "123", "999"];

  const randomWord = array => array[Math.floor(Math.random() * array.length)];
  const randomRoomName = `${randomWord(gamblingWords)} ${randomWord(roomTypes)} ${randomWord(numberSuffixes)}`;

  return randomRoomName;
}

function newRoom(roomName, game, owner) {
  let uuid = uuidV4()
  const newRoom = {
    id: uuid,
    game: game,
    owner,
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
  const roomIndex = rooms.findIndex(room => room.id === roomId);
  if (roomIndex !== -1) {
    const room = rooms[roomIndex];
    room.users = room.users.filter(user => user !== userName);

    if (room.users.length === 0) {
      rooms.splice(roomIndex, 1); // Remove the room if no users are left
    }
  }
}



function getRoomDetails(roomId) {
  const room = rooms.find(room => room.id === roomId);
  if (!room || !room.users) {
    return null; // or handle the case where room or users are undefined/null
  }
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
    if (getUserDetails(data.name) ) {
      if (getUserDetails(data.name) == data.id) return  
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

  socket.on("new_room", (data) => {
    if (getUserDetails(data)) {
      const old_room = getUserDetails(data)
      leaveRoom(data, old_room)
      socket.leave(old_room)
      socket.to(old_room).emit("get_room", getRoomDetails(old_room));
      socket.emit("get_room", getRoomDetails(old_room));
    }
    const new_room = newRoom(createRandomRoomName(),"roulette",data)
    joinRoom(data, new_room.id)
    socket.join(new_room.id)
    socket.to(new_room.id).emit("get_room", getRoomDetails(new_room.id));
    socket.emit("get_room", getRoomDetails(new_room.id));
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