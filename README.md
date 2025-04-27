# Проект интернет-магазина с GraphQL и WebSocket

Этот проект представляет собой полнофункциональный интернет-магазин с реализацией REST API, GraphQL API и WebSocket для чата в реальном времени между покупателями и администраторами.


## Установка

### Предварительные требования

- Node.js (версия 14 или выше)
- npm (обычно устанавливается вместе с Node.js)

### Шаги установки

1. Клонируйте репозиторий:
```bash
git clone https://github.com/ваш-аккаунт/shop-project.git
cd shop-project
```

2. Установите зависимости для всех серверов:
```bash
# Для сервера товаров
cd product-server
npm install

# Для административного сервера
cd ../admin-server
npm install

# Для GraphQL сервера
cd ../graphql-server
npm install

# Для WebSocket сервера
cd ../websocket-server
npm install
```

## Запуск

Для полноценной работы необходимо запустить все четыре сервера в разных терминалах:

1. Запустите сервер товаров (REST API):
```bash
cd product-server
node index.js
```
Сервер будет доступен по адресу: http://localhost:3000

2. Запустите административный сервер:
```bash
cd admin-server
node index.js
```
Административная панель будет доступна по адресу: http://localhost:8080  
Swagger документация: http://localhost:8080/api-docs

3. Запустите GraphQL сервер:
```bash
cd graphql-server
node index.js
```
GraphQL Playground будет доступен по адресу: http://localhost:4000/graphql  
Документация GraphQL: http://localhost:4000/

4. Запустите WebSocket сервер:
```bash
cd websocket-server
node index.js
```
Тестовая страница чата будет доступна по адресу: http://localhost:5001/

5. Откройте клиентскую часть в браузере:
   - Откройте файл `frontend/index.html` в браузере
   - Если вы хотите запустить клиентскую часть через HTTP-сервер:
   ```bash
   npx serve frontend
   ```
   И затем откройте URL, указанный в выводе команды (обычно http://localhost:5000).

## API документация

### REST API
Документация REST API доступна через Swagger UI по адресу http://localhost:8080/api-docs. Здесь вы можете просмотреть все доступные эндпоинты, параметры запросов и протестировать API прямо из браузера.

### GraphQL API
Документация GraphQL API доступна по адресу http://localhost:4000/, а интерактивный GraphQL Playground - по адресу http://localhost:4000/graphql.


### WebSocket API
WebSocket API документация доступна по адресу http://localhost:5001/. Здесь вы найдете информацию о формате сообщений и тестовую страницу для проверки функциональности чата.

