// Импортируем необходимые модули
const express = require('express');
const http = require('http');
const path = require('path');
const WebSocket = require('ws');

// Создаем новый экземпляр приложения
const app = express();

// Настраиваем статическую директорию для клиентских файлов
app.use(express.static(path.join(__dirname, 'public')));

// Создаем HTTP-сервер на основе приложения
const server = http.createServer(app);

// Создаем новый WebSocket-сервер, привязанный к серверу HTTP
const wss = new WebSocket.Server({ server });

// Обработка подключения нового клиента
wss.on('connection', (ws) => {
  // Обработка входящий сообщений 
  ws.on('message', (message) => {
    // Парсим полученное сообщение
    const data = JSON.parse(message);

    // Отправляем сообщение всем клиентам
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(data));
      }
    });
  });
});

// Запускаем сервер на порту 3000
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
})