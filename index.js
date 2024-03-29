const express = require('express');
const app = express();
const http = require('http').Server(app);

app.use(express.static(`${__dirname}/public`));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

const io = require('socket.io')(http, {
  cors: {
    origin: '*',
  },
});

const users = {};

io.on('connect', socket => {
  // Tell Server New ppl joined
  socket.on('new-person-joined', name => {
    users[socket.id] = name;
    socket.broadcast.emit('person-joined', name);
    console.warn(`${name} joined`);
  });

  // Recived a new message
  socket.on('send', message => {
    console.log(`${users[socket.id]}: "${message.message}"`);
    // Tell other users there is a message
    socket.broadcast.emit('recive', {
      message: message.message,
      user: users[socket.id],
    });
  });

  // Let server know a person disconnected
  socket.on('disconnect', message => {
    // Let other ppl know too
    socket.broadcast.emit('leave', users[socket.id]);
    console.warn(`${users[socket.id]} left`);
    delete users[socket.id];
  });
});

port = process.env.PORT || 3000;

http.listen(port, () => {
  console.log(`Server Running at http://localhost:${port}/`);
});
