# Установка базового образа Node.js
FROM node

# Установка рабочей директории
WORKDIR /app1

# Копирование зависимостей и установка их через npm


# Копирование файлов программы API
COPY . .
RUN npm init -y
RUN npm i
RUN npm install sqlite3
RUN npm install sqlite3 --build-from
RUN npm install https://github.com/mapbox/node-sqlite3/tarball/master

# Определение команды запуска приложения
CMD [ "node", "g.js" ]
