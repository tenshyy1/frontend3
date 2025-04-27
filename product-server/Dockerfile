# Базовый образ Node.js
FROM node:14

# Установка рабочей директории
WORKDIR /app

# Копирование package.json и package-lock.json
COPY package*.json ./

# Установка зависимостей
RUN npm install

# Копирование остального кода
COPY . .

# Команда для запуска сервера
CMD ["node", "index.js"]