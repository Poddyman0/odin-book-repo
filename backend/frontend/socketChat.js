document.addEventListener("DOMContentLoaded", () => {
    let counter = 0;
    const userID = localStorage.getItem('userIDSignedIn');
    const userToMessage = localStorage.getItem('userToMessage');
  console.log("userToMessage", userToMessage)
    const socket = io("odin-book-repo-production.up.railway.app", {
        auth: {
        serverOffset: 0,
        userID,
        userToMessage
        },
            // enable retries
        ackTimeout: 10000,
        retries: 3,
    });
  const form = document.getElementById('form');
  const input = document.getElementById('input');
  const messages = document.getElementById('messages');
    // chat message
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (input.value) {
              // compute a unique offset
  const clientOffset = `${socket.id}-${counter++}`;

  //sent
  socket.emit('chat message', input.value, userID, userToMessage, clientOffset);
      input.value = '';
    }
  });
// recieved
  socket.on('chat message', (msg, author, userToMessage, serverOffset) => {
    console.log("userToMessage", userToMessage)

  const item = document.createElement('li');
  item.innerHTML = `<strong>${author}:</strong> ${msg}`;
  messages.appendChild(item);
  window.scrollTo(0, document.body.scrollHeight);
  socket.auth.serverOffset = serverOffset;

  });
});