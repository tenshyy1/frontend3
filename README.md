# Проект интернет-магазина с GraphQL и WebSocket

Этот проект представляет собой полнофункциональный интернет-магазин с реализацией REST API, GraphQL API и WebSocket для чата в реальном времени между покупателями и администраторами.

## Установка

### Предварительные требования

- Docker (последняя версия)
- Docker Compose (последняя версия)
- Node.js (версия 14 или выше, только для ручного запуска без Docker)
- npm (только для ручного запуска)

### Шаги установки

1. Клонируйте репозиторий:
   ```bash
   git clone https://github.com/tenshyy1/frontend3.git
   cd frontend3

2. Убедитесь, что Docker и Docker Compose установлены:
```bash
# Для проверки Docker
docker --version

# Для проверки Docker Compose
docker-compose --version

```


## Запуск с помощью Docker

1. В корне проекта выполните команду для сборки и запуска всех сервисов:
```bash
docker-compose up --build
```


2. После успешного запуска все сервисы будут доступны по следующим адресам:
```bash
Admin Server: http://localhost:8080 (Swagger документация: http://localhost:8080/api-docs)
Product Server: http://localhost:3000
GraphQL Server: http://localhost:4000/graphql (Документация: http://localhost:4000/)
WebSocket Server: http://localhost:5001
Frontend: http://localhost:5000
```


3. Для остановки всех сервисов используйте:
```bash
docker-compose down
```


## Ручной запуск (без Docker)

1. Установите зависимости для всех серверов:
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


