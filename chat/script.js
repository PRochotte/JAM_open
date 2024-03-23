function sendMessage() {
    var message = document.getElementById('user-message').value;
    if (message.trim() !== '') {
        var messageDiv = document.createElement('div');
        messageDiv.textContent = message;
        messageDiv.classList.add('message');
        document.getElementById('chat-messages').appendChild(messageDiv);
        document.getElementById('user-message').value = '';
    }
}
