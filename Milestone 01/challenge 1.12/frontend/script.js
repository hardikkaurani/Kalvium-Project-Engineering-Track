const chatMessages = document.getElementById('chatMessages');
const messageInput = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');

const API_BASE_URL = 'http://localhost:3000';

// Send message function
async function sendMessage() {
  const message = messageInput.value.trim();
  
  if (!message) return;

  // Add user message to chat
  addMessageToChat(message, 'user-message');
  messageInput.value = '';

  try {
    // Send message to backend
    const response = await fetch(`${API_BASE_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    });

    if (!response.ok) {
      throw new Error('Failed to get response from server');
    }

    const data = await response.json();
    
    // Add bot response to chat
    addMessageToChat(data.message, 'bot-message');
  } catch (error) {
    console.error('Error:', error);
    addMessageToChat('Sorry, I encountered an error. Please try again.', 'bot-message');
  }
}

// Add message to chat display
function addMessageToChat(message, className) {
  const messageElement = document.createElement('div');
  messageElement.className = `message ${className}`;
  messageElement.innerHTML = `<p>${escapeHtml(message)}</p>`;
  chatMessages.appendChild(messageElement);
  
  // Scroll to bottom
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Event listeners
sendButton.addEventListener('click', sendMessage);
messageInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    sendMessage();
  }
});
