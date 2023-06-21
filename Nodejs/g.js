const express = require('express');
const app = express();
const port = 3000;
const main = require('./main');


var users = {}

// Маршрут для отображения HTML страницы с графиком
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Маршрут для получения данных графика
app.get('/data', (req, res) => {
  // Здесь можно реализовать логику для получения данных графика
  // В данном примере просто возвращаем статические данные
  main(req.query.id1, req.query.id2, req.query.st).then((d) => {
    const data = d;
    res.json(data);
  });
  
});

// Запуск сервера
app.listen(port, () => {
  console.log(`Сервер запущен на порту ${port}`);
});
