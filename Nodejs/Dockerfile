# Установка базового образа Node.js
FROM node

# Установка рабочей директории
WORKDIR /app1

# Копирование зависимостей и установка их через npm


# Копирование файлов программы API
COPY . .
RUN npm init -y
RUN npm i
RUN npm install sqlite3 && npm install --build-from-source

# Определение команды запуска приложения
CMD [ "node", "g.js" ]
