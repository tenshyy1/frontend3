const express = require('express');
const path = require('path');

const app = express();
const PORT = 8040;

app.use(express.static(path.join(__dirname, '../front')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../front/index.html'));
});

app.listen(PORT, () => {
  console.log(`✅ Сервер запущен: http://localhost:${PORT}`);
});
