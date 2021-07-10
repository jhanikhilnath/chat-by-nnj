const socket = io('http://127.0.0.1:3000/');

const form = document.querySelector('.send-chat');
const container = document.querySelector('.chat-container');
const messageCont = document.querySelector('#send-text');

const append = function (message, position) {
  const newMsg = document.createElement('div');
  newMsg.innerText = message;
  newMsg.classList.add('message');
  newMsg.classList.add(position);
  container.appendChild(newMsg);
  messageCont.value = '';
  scroll();
};

const name = prompt('Enter your name to continue: ');

socket.emit('new-person-joined', name);

form.addEventListener('submit', e => {
  e.preventDefault();
  const message = messageCont.value;
  append(`You: ${message}`, 'right');

  socket.emit('send', { message });
});

socket.on('person-joined', name => {
  append(`${name} joined the chat`, 'left');
});

socket.on('recive', data => {
  append(`${data.user}: ${data.message}`, 'left');
});

function scroll() {
  container.scrollTop = container.scrollHeight;
}
