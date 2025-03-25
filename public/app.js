// Получаем ссылки на элементы интерфейса
const loginForm = document.getElementById('login-form');
const chatInterface = document.getElementById('chat-interface');
const usernameInput = document.getElementById('username-input');
const messageInput = document.getElementById('message-input');
const sendBtn = document.getElementById('send-btn');
const messageContainer = document.getElementById('message-container');
const joinBtn = document.getElementById('join-btn');

// Объявляем перенную для WebSocket-соединения
let socket;

// Имя текущего пользователя
let username = '';

// Функция для добавления системных сообщений
function addSystemMessage(text) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('system-message');
    messageElement.textContent = text;
    messageContainer.append(messageElement);
    messageContainer.scrollTop = messageContainer.scrollHeight;
}

// Функция для подключения к WebSocket-серверу
function connectToWebSocket() {
    try {
        socket = new WebSocket('ws://localhost:3000');

        socket.onopen = () => {
            addSystemMessage('Подключение успешно');
        }

        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            addSystemMessage(`Пользователь ${data.username}: ${data.message}`);
        }

        socket.onerror = () => {
            addSystemMessage('Произошла ошибка подключения');
        }

        socket.onclose = () => {
            addSystemMessage('Соединение закрыто');
        }
    } catch (error) {
        addSystemMessage(`не удалось подключиться к серверу ${error.message}`);
    }
}

// Функция для отправки сообщений
function sendMessage(text) {
    if (socket && socket.readyState === WebSocket.OPEN) {
        const message = {
            username: username,
            message: text
        };
        socket.send(JSON.stringify(message));
    } else {
        addSystemMessage('Ошибка отправки сообщения');
        connectToWebSocket();
    }
}

// Функция для добавления сообщений пользователя
function appendMessage(sender, text) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message');

    const usernameElement = document.createElement('div');
    usernameElement.classList.add('message__username');
    usernameElement.textContent = sender;

    const textElement = document.createElement('div');
    textElement.classList.add('message__text');
    textElement.textContent = text;

    messageElement.append(usernameElement);
    messageElement.append(textElement);
    messageContainer.append(messageElement);
    messageContainer.scrollTop = messageContainer.scrollHeight;
}

// Обработчик отправки сообщений 
joinBtn.addEventListener('click', function (e) {
    const userNameInput = usernameInput.value.trim();
    if (userNameInput) {
        username = userNameInput;

        loginForm.classList.add('login_hidden');
        chatInterface.classList.remove('chat__interface_hidden');
        connectToWebSocket();
        messageInput.focus();
    }
});

// Обработчик отправки сообщений
sendBtn.addEventListener('click', function (e) {
    const text = messageInput.value.trim();

    if (text) {
        sendMessage(text);
        messageInput.value = '';
        messageInput.focus();
    }
});

// Обработчик нажатия клавиши Enter
messageInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        const text = messageInput.value.trim();

        if (text) {
            sendMessage(text);
            messageInput.value = '';
            messageInput.focus();
        }
    }
});