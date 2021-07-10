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

port = process.env.PORT || 3000;

http.listen(port, () => {
  console.log(`Server Running`);
});
