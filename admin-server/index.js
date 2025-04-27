const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Создаем экземпляр приложения Express
const app = express();
const PORT = 8080;

// Промежуточное ПО для разбора JSON-запросов
app.use(express.json());

// Разрешаем CORS для всех источников
app.use(cors());

// Обслуживание статических файлов из текущей директории
app.use(express.static(__dirname));

// Настройки Swagger
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API интернет-магазина',
      version: '1.0.0',
      description: 'API для управления товарами в интернет-магазине',
    },
    servers: [
      {
        url: 'http://localhost:8080',
        description: 'Сервер разработки',
      },
    ],
    components: {
      schemas: {
        Product: {
          type: 'object',
          required: ['name', 'price', 'description', 'categoryId'],
          properties: {
            id: {
              type: 'integer',
              description: 'Уникальный идентификатор товара'
            },
            name: {
              type: 'string',
              description: 'Название товара'
            },
            price: {
              type: 'number',
              format: 'float',
              description: 'Цена товара'
            },
            description: {
              type: 'string',
              description: 'Описание товара'
            },
            categoryId: {
              type: 'integer',
              description: 'Идентификатор категории товара'
            }
          }
        }
      }
    }
  },
  apis: ['./index.js'], // Путь к файлам с комментариями JSDoc
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Путь к файлу с данными о товарах
const PRODUCTS_FILE = path.join(__dirname, '..', 'product-server', 'products.json');

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

// Маршрут для главной страницы администратора
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin.html'));
});

// API маршруты для администрирования

// Получение всех товаров и категорий
/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Получение всех товаров и категорий
 *     description: Возвращает полный список товаров и категорий
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Успешный ответ с данными
 */
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

// Добавление нового товара
app.post('/api/products', (req, res) => {
  const data = readProductsFile();
  const newProduct = req.body;
  
  // Проверка наличия обязательных полей
  if (!newProduct.name || !newProduct.price || !newProduct.description || !newProduct.categoryId) {
    return res.status(400).json({ error: 'Отсутствуют обязательные поля' });
  }
  
  // Присваиваем новый ID (максимальный ID + 1)
  const maxId = data.products.reduce((max, product) => Math.max(max, product.id), 0);
  newProduct.id = maxId + 1;
  
  // Добавляем новый товар
  data.products.push(newProduct);
  
  // Записываем обновленные данные в файл
  if (writeProductsFile(data)) {
    res.status(201).json(newProduct);
  } else {
    res.status(500).json({ error: 'Ошибка при сохранении товара' });
  }
});

// Обновление информации о товаре
app.put('/api/products/:id', (req, res) => {
  const data = readProductsFile();
  const id = parseInt(req.params.id);
  const updatedProduct = req.body;
  
  // Находим индекс товара в массиве
  const index = data.products.findIndex(p => p.id === id);
  
  if (index === -1) {
    return res.status(404).json({ error: 'Товар не найден' });
  }
  
  // Обновляем товар, сохраняя его ID
  updatedProduct.id = id;
  data.products[index] = updatedProduct;
  
  // Записываем обновленные данные в файл
  if (writeProductsFile(data)) {
    res.json(updatedProduct);
  } else {
    res.status(500).json({ error: 'Ошибка при обновлении товара' });
  }
});

// Удаление товара
app.delete('/api/products/:id', (req, res) => {
  const data = readProductsFile();
  const id = parseInt(req.params.id);
  
  // Находим индекс товара в массиве
  const index = data.products.findIndex(p => p.id === id);
  
  if (index === -1) {
    return res.status(404).json({ error: 'Товар не найден' });
  }
  
  // Удаляем товар из массива
  data.products.splice(index, 1);
  
  // Записываем обновленные данные в файл
  if (writeProductsFile(data)) {
    res.json({ message: 'Товар успешно удален' });
  } else {
    res.status(500).json({ error: 'Ошибка при удалении товара' });
  }
});

// Получение всех категорий
app.get('/api/categories', (req, res) => {
  const data = readProductsFile();
  res.json(data.categories);
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Сервер администрирования запущен на порту ${PORT}`);
  console.log(`Доступ к панели администратора: http://localhost:${PORT}`);
});