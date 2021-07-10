const app = require('express')();
const http = require('http').Server(app);

const io = require('socket.io')(http, {
  cors: {
    origin: '*',
  },
});

const users = {};

io.on('connection', socket => {
  socket.on('new-person-joined', name => {
    users[socket.id] = name;
    socket.broadcast.emit('person-joined', name);
  });

  socket.on('send', message => {
    socket.broadcast.emit('recive', {
      message: message.message,
      user: users[socket.id],
    });
  });
});

http.listen(3000, () => {
  console.log(`Server Running`);
});
