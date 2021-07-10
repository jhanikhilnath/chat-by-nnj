const io = require('socket.io')(3000, {
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
