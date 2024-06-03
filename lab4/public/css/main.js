document.addEventListener("DOMContentLoaded", function() {
    console.log('main.js');
  
    const roomName = document.getElementById('roomName').innerText;
    const messageForm = document.getElementById('messageForm');
    const messagesDiv = document.getElementById('messages');
  
    console.log(`Room name: ${roomName}`);
  
    async function fetchMessages() {
      console.log(`Fetch messages for room: ${roomName}`);
      try {
        const response = await fetch(`/${roomName}/messages`);
        if (response.ok) {
          const messages = await response.json();
          console.log(`Received ${messages.length} messages for room: ${roomName}`);
          messagesDiv.innerHTML = '';
          messages.forEach(message => {
            const messageElement = document.createElement('div');
            messageElement.innerText = `${message.timestamp} - ${message.nickname}: ${message.body}`;
            messagesDiv.appendChild(messageElement);
          });
        } else {
          console.error('Failed', response.statusText);
        }
      } catch (error) {
        console.error('Error', error);
      }
    }
  
    async function sendMessage(event) {
      event.preventDefault();
      const nickname = document.getElementById('nicknameInput').value;
      const body = document.getElementById('messageInput').value;
      console.log(`Sending message from ${nickname} in room: ${roomName}`);
      try {
        const response = await fetch(`/${roomName}/messages`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ nickname, body })
        });
        if (response.ok) {
          document.getElementById('messageInput').value = '';
          fetchMessages();
        } else {
          console.error('Failed', response.statusText);
        }
      } catch (error) {
        console.error('Error', error);
      }
    }
  
    messageForm.addEventListener('submit', sendMessage);
    setInterval(fetchMessages, 3000);
    fetchMessages();
  });
  