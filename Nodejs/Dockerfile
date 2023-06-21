# Установка базового образа Node.js
FROM node

# Установка рабочей директории
WORKDIR /app

# Копирование зависимостей и установка их через npm
COPY package*.json ./
RUN npm ci --only=production
RUN npm install sqlite3

# Копирование файлов программы API
COPY . .

# Определение команды запуска приложения
CMD [ "node", "g.js" ]
