const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const cors = require('cors');
const path = require('path');

// Создаем экземпляр приложения Express
const app = express();
const PORT = 5001;

// Промежуточное ПО для разбора JSON-запросов
app.use(express.json());

// Разрешаем CORS для всех источников
app.use(cors());

// Обслуживание статических файлов
app.use(express.static(path.join(__dirname, 'public')));

// Маршрут для документации WebSocket
app.get('/', (req, res) => {
  res.send(`
    <html>
      <head>
        <title>WebSocket Chat API</title>
        <style>
          body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
          h1, h2 { color: #333; }
          pre { background-color: #f5f5f5; padding: 10px; border-radius: 5px; overflow-x: auto; }
          .section { margin-bottom: 30px; }
          .code { font-family: monospace; background-color: #f0f0f0; padding: 2px 4px; border-radius: 3px; }
          #chat-container { margin-top: 30px; border: 1px solid #ddd; border-radius: 5px; overflow: hidden; }
          #chat-messages { height: 300px; padding: 10px; overflow-y: auto; background-color: #f9f9f9; }
          #chat-form { display: flex; padding: 10px; background-color: #f0f0f0; }
          #message-input { flex-grow: 1; padding: 8px; margin-right: 10px; border: 1px solid #ddd; border-radius: 4px; }
          button { padding: 8px 15px; background-color: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer; }
          button:hover { background-color: #45a049; }
          .message { margin-bottom: 10px; padding: 8px; border-radius: 4px; }
          .admin { background-color: #e3f2fd; text-align: right; }
          .customer { background-color: #f1f8e9; }
          .system { background-color: #fff3e0; font-style: italic; text-align: center; }
        </style>
      </head>
      <body>
        <h1>WebSocket Chat API</h1>
        
        <div class="section">
          <h2>О сервисе</h2>
          <p>Этот сервер предоставляет WebSocket API для обмена сообщениями между покупателями и администраторами магазина.</p>
          <p>WebSocket эндпоинт: <span class="code">ws://localhost:5001/chat</span></p>
        </div>
        
        <div class="section">
          <h2>Формат сообщений</h2>
          <p>Клиент отправляет сообщения в формате JSON:</p>
          <pre>
{
  "type": "message",
  "userType": "customer", // или "admin"
  "userId": "unique-user-id",
  "username": "Имя пользователя",
  "content": "Текст сообщения"
}
          </pre>
          
          <p>Сервер отвечает сообщениями в формате JSON:</p>
          <pre>
{
  "type": "message",
  "userType": "customer", // или "admin", или "system"
  "userId": "unique-user-id",
  "username": "Имя пользователя",
  "content": "Текст сообщения",
  "timestamp": "2023-04-15T12:34:56.789Z"
}
          </pre>
        </div>
        
        <div class="section">
          <h2>Пример использования</h2>
          <pre>
// Подключение к WebSocket серверу
const socket = new WebSocket('ws://localhost:5001/chat');

// Обработка открытия соединения
socket.onopen = function(event) {
  console.log('Соединение установлено');
  
  // Отправка сообщения
  const message = {
    type: 'message',
    userType: 'customer',
    userId: 'user123',
    username: 'Иван',
    content: 'Здравствуйте! У меня вопрос по товару.'
  };
  
  socket.send(JSON.stringify(message));
};

// Обработка входящих сообщений
socket.onmessage = function(event) {
  const message = JSON.parse(event.data);
  console.log('Получено сообщение:', message);
  
  // Отображение сообщения в чате
  displayMessage(message);
};
          </pre>
        </div>
        
        <div id="chat-container">
          <h2 style="margin: 0; padding: 10px; background-color: #f0f0f0; border-bottom: 1px solid #ddd;">Тестовый чат</h2>
          <div id="chat-messages"></div>
          <form id="chat-form">
            <select id="user-type" style="padding: 8px; margin-right: 10px; border: 1px solid #ddd; border-radius: 4px;">
              <option value="customer">Покупатель</option>
              <option value="admin">Администратор</option>
            </select>
            <input type="text" id="username" placeholder="Ваше имя" style="padding: 8px; margin-right: 10px; border: 1px solid #ddd; border-radius: 4px;">
            <input type="text" id="message-input" placeholder="Введите сообщение...">
            <button type="submit">Отправить</button>
          </form>
        </div>
        
        <script>
          const chatMessages = document.getElementById('chat-messages');
          const chatForm = document.getElementById('chat-form');
          const messageInput = document.getElementById('message-input');
          const userTypeSelect = document.getElementById('user-type');
          const usernameInput = document.getElementById('username');
          
          // Создаем уникальный ID пользователя
          const userId = 'user_' + Math.random().toString(36).substr(2, 9);
          
          // Подключение к WebSocket серверу
          const socket = new WebSocket('ws://localhost:5001/chat');
          
          // Обработка открытия соединения
          socket.onopen = function(event) {
            addSystemMessage('Соединение установлено');
          };
          
          // Обработка входящих сообщений
          socket.onmessage = function(event) {
            const message = JSON.parse(event.data);
            addMessageToChat(message);
          };
          
          // Обработка ошибок
          socket.onerror = function(error) {
            addSystemMessage('Ошибка соединения');
            console.error('WebSocket ошибка:', error);
          };
          
          // Обработка закрытия соединения
          socket.onclose = function(event) {
            addSystemMessage('Соединение закрыто');
          };
          
          // Обработка отправки формы
          chatForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            const content = messageInput.value.trim();
            const userType = userTypeSelect.value;
            const username = usernameInput.value.trim() || 'Аноним';
            
            if (content && socket.readyState === WebSocket.OPEN) {
              const message = {
                type: 'message',
                userType: userType,
                userId: userId,
                username: username,
                content: content
              };
              
              socket.send(JSON.stringify(message));
              messageInput.value = '';
            }
          });
          
          // Добавление сообщения в чат
          function addMessageToChat(message) {
            const messageElement = document.createElement('div');
            messageElement.classList.add('message');
            
            if (message.userType === 'system') {
              messageElement.classList.add('system');
              messageElement.textContent = message.content;
            } else {
              messageElement.classList.add(message.userType);
              messageElement.innerHTML = "<strong>" + message.username + "</strong>: " + message.content;
            }
            
            chatMessages.appendChild(messageElement);
            chatMessages.scrollTop = chatMessages.scrollHeight;
          }
          
          // Добавление системного сообщения
          function addSystemMessage(content) {
            addMessageToChat({
              type: 'message',
              userType: 'system',
              content: content
            });
          }
        </script>
      </body>
    </html>
  `);
});

// Создаем HTTP сервер
const server = http.createServer(app);

// Создаем WebSocket сервер
const wss = new WebSocket.Server({ server });

// Хранение активных клиентов
const clients = new Map();

// Обработка WebSocket соединений
wss.on('connection', (ws) => {
  // Генерируем уникальный ID для клиента
  const clientId = Math.random().toString(36).substring(2, 15);
  
  // Сохраняем информацию о клиенте
  const clientInfo = {
    id: clientId,
    userType: null,
    username: null,
    ws
  };
  clients.set(clientId, clientInfo);
  
  // Отправляем системное сообщение о подключении
  const connectMessage = {
    type: 'message',
    userType: 'system',
    content: 'Новый пользователь подключился к чату',
    timestamp: new Date().toISOString()
  };
  
  broadcastMessage(JSON.stringify(connectMessage));
  
  // Обработка входящих сообщений
  ws.on('message', (message) => {
    try {
      const parsedMessage = JSON.parse(message);
      
      // Обновляем информацию о клиенте, если она отсутствует
      if (!clientInfo.userType && parsedMessage.userType) {
        clientInfo.userType = parsedMessage.userType;
      }
      
      if (!clientInfo.username && parsedMessage.username) {
        clientInfo.username = parsedMessage.username;
      }
      
      // Добавляем временную метку и ID клиента
      parsedMessage.timestamp = new Date().toISOString();
      parsedMessage.clientId = clientId;
      
      // Отправляем сообщение всем клиентам
      broadcastMessage(JSON.stringify(parsedMessage));
    } catch (error) {
      console.error('Ошибка при обработке сообщения:', error);
    }
  });
  
  // Обработка закрытия соединения
  ws.on('close', () => {
    // Удаляем клиента из списка активных
    clients.delete(clientId);
    
    // Отправляем системное сообщение о отключении
    const disconnectMessage = {
      type: 'message',
      userType: 'system',
      content: `${clientInfo.username || 'Пользователь'} (${clientInfo.userType || 'неизвестный тип'}) отключился от чата`,
      timestamp: new Date().toISOString()
    };
    
    broadcastMessage(JSON.stringify(disconnectMessage));
  });
});

// Функция для отправки сообщения всем клиентам
function broadcastMessage(message) {
  clients.forEach((client) => {
    if (client.ws.readyState === WebSocket.OPEN) {
      client.ws.send(message);
    }
  });
}

// Запуск сервера
server.listen(PORT, () => {
  console.log(`WebSocket сервер запущен на порту ${PORT}`);
  console.log(`Страница тестирования чата доступна по адресу: http://localhost:${PORT}/`);
});