const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

// Создаем экземпляр приложения Express
const app = express();
const PORT = 3000;

// Промежуточное ПО для разбора JSON-запросов
app.use(express.json());

// Разрешаем CORS для всех источников
app.use(cors());

// Обслуживание статических файлов из текущей директории
app.use(express.static(path.join(__dirname, '..')));

// Путь к файлу с данными о товарах
const PRODUCTS_FILE = path.join(__dirname, 'products.json');

// Вспомогательная функция для чтения данных из файла
function readProductsFile() {
  try {
    const data = fs.readFileSync(PRODUCTS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Ошибка при чтении файла с товарами:', error);
    return { categories: [], products: [] };
  }
}

// Вспомогательная функция для записи данных в файл
function writeProductsFile(data) {
  try {
    fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Ошибка при записи в файл с товарами:', error);
    return false;
  }
}

// Если файл с товарами не существует, создаем его с начальными данными
if (!fs.existsSync(PRODUCTS_FILE)) {
  const initialData = {
    categories: [
      { id: 1, name: "Электроника" },
      { id: 2, name: "Книги" }
    ],
    products: [
      {
        id: 1,
        name: "Смартфон XYZ",
        price: 799.99,
        description: "Современный смартфон с высокой производительностью",
        categoryId: 1
      },
      {
        id: 2,
        name: "Ноутбук ABC",
        price: 1299.99,
        description: "Легкий и мощный ноутбук для работы",
        categoryId: 1
      },
      {
        id: 3,
        name: "Программирование на JavaScript",
        price: 35.50,
        description: "Подробное руководство по современному JavaScript",
        categoryId: 2
      },
      {
        id: 4,
        name: "История науки",
        price: 25.75,
        description: "Увлекательное путешествие по истории научных открытий",
        categoryId: 2
      },
      {
        id: 5,
        name: "Беспроводные наушники",
        price: 149.99,
        description: "Наушники с активным шумоподавлением и долгим временем работы",
        categoryId: 1
      }
    ]
  };
  writeProductsFile(initialData);
  console.log('Создан файл с начальными данными о товарах');
}

// Маршрут для главной страницы
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
});

// API маршруты

// Получение всех товаров и категорий
app.get('/api/products', (req, res) => {
  const data = readProductsFile();
  res.json(data);
});

// Получение конкретного товара по ID
app.get('/api/products/:id', (req, res) => {
  const data = readProductsFile();
  const product = data.products.find(p => p.id === parseInt(req.params.id));
  
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ error: 'Товар не найден' });
  }
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Сервер для отображения товаров запущен на порту ${PORT}`);
  console.log(`Доступ к каталогу товаров: http://localhost:${PORT}`);
});