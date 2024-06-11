document.addEventListener("DOMContentLoaded", function() {
  console.log("main.js is loaded and running");

  const roomName = document.getElementById('roomName').innerText;
  const messageForm = document.getElementById('messageForm');
  const messagesDiv = document.getElementById('messages');
  const searchForm = document.getElementById('searchForm');
  const searchInput = document.getElementById('searchInput');
  let isSearching = false;

  // Function to sanitize user input
  const sanitizeInput = (input) => {
    return DOMPurify.sanitize(input);
  };

  async function fetchMessages(query = '') {
    const url = query ? `/${roomName}/search?query=${query}` : `/${roomName}/messages`;
    try {
      const response = await fetch(url);
      if (response.ok) {
        const messages = await response.json();
        messagesDiv.innerHTML = '';
        messages.forEach(message => {
          const messageElement = document.createElement('div');
          messageElement.innerHTML = `
            <p>${new Date(message.timestamp).toLocaleString()} - ${message.nickname}: ${message.body} ${message.edited ? '(edited)' : ''}</p>
            <button onclick="editMessage('${message._id}')">Edit</button>
            <button onclick="deleteMessage('${message._id}')">Delete</button>
          `;
          messagesDiv.appendChild(messageElement);
        });
      } else {
        console.error('Failed to fetch messages:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  }

  async function sendMessage(event) {
    event.preventDefault();
    const nickname = document.getElementById('nicknameInput').value;
    const body = document.getElementById('messageInput').value;
    try {
      const response = await fetch(`/${roomName}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nickname, body })
      });
      if (response.ok) {
        document.getElementById('messageInput').value = '';
        fetchMessages();
      } else {
        console.error('Failed to send message:', response.statusText);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  }

  window.editMessage = async function(messageId) {
    const newBody = prompt('Edit your message:');
    if (newBody) {
      try {
        const response = await fetch(`/${roomName}/messages/${messageId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ body: newBody })
        });
        if (response.ok) {
          fetchMessages();
        } else {
          console.error('Failed to edit message:', response.statusText);
        }
      } catch (error) {
        console.error('Error editing message:', error);
      }
    }
  }

  window.deleteMessage = async function(messageId) {
    if (confirm('Are you sure you want to delete this message?')) {
      try {
        const response = await fetch(`/${roomName}/messages/${messageId}`, {
          method: 'DELETE'
        });
        if (response.ok) {
          fetchMessages();
        } else {
          console.error('Failed to delete message:', response.statusText);
        }
      } catch (error) {
        console.error('Error deleting message:', error);
      }
    }
  }

  async function searchMessages(event) {
    event.preventDefault();
    const query = searchInput.value;
    isSearching = true;
    fetchMessages(query);
  }

  messageForm.addEventListener('submit', sendMessage);
  searchForm.addEventListener('submit', searchMessages);

  // Fetch messages every 3 seconds
  setInterval(() => {
    if (!isSearching) {
      fetchMessages();
    }
  }, 3000);

  fetchMessages();
});
