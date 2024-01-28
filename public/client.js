const socket = io();
console.log('Client initiated');

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
  scroll();
};

function getName() {
  let name;
  while (true) {
    name = prompt('Enter your name to continue: ').trim();

    if (name) {
      break;
    }
  }
  return name;
}

async function init() {
  const name = await getName();
  socket.emit('new-person-joined', name);
}

await init();

console.log(name);

form.addEventListener('submit', e => {
  e.preventDefault();
  const message = messageCont.value.trim();

  if (!message) {
    return;
  }

  append(`<strong>You:</strong> ${message}`, 'right', true);

  socket.emit('send', { message });
  messageCont.value = '';
});

socket.on('person-joined', name => {
  append(`<strong><i>${name} joined the chat</i></strong>`, 'left');
});

socket.on('leave', name => {
  append(`<strong><i>${name} left the chat</i></strong>`, 'left');
});

socket.on('recive', data => {
  append(`<strong>${data.user}:</strong>  ${data.message}`, 'left');
});

function scroll() {
  container.scrollTop = container.scrollHeight;
}
