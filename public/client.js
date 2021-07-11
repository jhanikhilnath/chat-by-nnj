const socket = io();
console.log('s');

const form = document.querySelector('.send-chat');
const container = document.querySelector('.chat-container');
const messageCont = document.querySelector('#send-text');

const append = function (message, position, out = false) {
  const newMsg = document.createElement('div');
  newMsg.innerHTML = message;
  newMsg.classList.add('message');
  newMsg.classList.add(position);

  if (out) newMsg.classList.add('outgoing');

  container.appendChild(newMsg);
  messageCont.value = '';
  scroll();
};

const name = prompt('Enter your name to continue: ');

socket.emit('new-person-joined', name);

form.addEventListener('submit', e => {
  e.preventDefault();
  const message = messageCont.value;
  append(`<strong>You:</strong> ${message}`, 'right', true);

  socket.emit('send', { message });
});

socket.on('person-joined', name => {
  append(`<strong><i>${name} joined the chat</i></strong>`, 'left');
});

socket.on('leave', name => {
  append(`<strong><i>${name} left the chat</i></strong>`, 'left');
});

socket.on('recive', data => {
  append(`<strong>${data.user}:</strong> ${data.message}`, 'left');
});

function scroll() {
  container.scrollTop = container.scrollHeight;
}
