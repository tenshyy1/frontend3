const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const { ApolloServer } = require('apollo-server-express');
const { gql } = require('apollo-server-express');

// Создаем экземпляр приложения Express
const app = express();
const PORT = 4000;

// Промежуточное ПО для разбора JSON-запросов
app.use(express.json());

// Разрешаем CORS для всех источников
app.use(cors());

// Путь к файлу с данными о товарах (используем тот же файл, что и для REST API)
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

// Определение GraphQL схемы
const typeDefs = gql`
  type Category {
    id: ID!
    name: String!
  }

  type Product {
    id: ID!
    name: String!
    price: Float!
    description: String!
    categoryId: ID!
    category: Category
  }

  type Query {
    products: [Product!]!
    product(id: ID!): Product
    categories: [Category!]!
    productsByCategory(categoryId: ID!): [Product!]!
    productsBasicInfo: [ProductBasicInfo!]!
    productsWithDetails: [ProductWithDetails!]!
  }

  # Тип для получения только базовой информации (название и цена)
  type ProductBasicInfo {
    id: ID!
    name: String!
    price: Float!
  }

  # Тип для получения детальной информации (название и описание)
  type ProductWithDetails {
    id: ID!
    name: String!
    description: String!
    category: Category
  }
`;

// Определение резолверов
const resolvers = {
  Query: {
    products: () => {
      const data = readProductsFile();
      return data.products;
    },
    product: (_, { id }) => {
      const data = readProductsFile();
      return data.products.find(product => product.id === parseInt(id));
    },
    categories: () => {
      const data = readProductsFile();
      return data.categories;
    },
    productsByCategory: (_, { categoryId }) => {
      const data = readProductsFile();
      return data.products.filter(product => product.categoryId === parseInt(categoryId));
    },
    productsBasicInfo: () => {
      const data = readProductsFile();
      // Возвращаем только id, name и price для каждого продукта
      return data.products.map(({ id, name, price }) => ({ id, name, price }));
    },
    productsWithDetails: () => {
      const data = readProductsFile();
      // Возвращаем только id, name и description для каждого продукта
      return data.products.map(({ id, name, description, categoryId }) => ({ 
        id, 
        name, 
        description, 
        categoryId 
      }));
    }
  },
  Product: {
    category: (product) => {
      const data = readProductsFile();
      return data.categories.find(category => category.id === parseInt(product.categoryId));
    }
  },
  ProductWithDetails: {
    category: (product) => {
      const data = readProductsFile();
      return data.categories.find(category => category.id === parseInt(product.categoryId));
    }
  }
};

// Создание и настройка Apollo Server
async function startApolloServer() {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    introspection: true, // Разрешаем интроспекцию для инструментов разработки
    playground: true     // Включаем GraphQL Playground для тестирования запросов
  });

  await server.start();
  server.applyMiddleware({ app, path: '/graphql' });

  // Маршрут для документации GraphQL
  app.get('/', (req, res) => {
    res.send(`
      <html>
        <head>
          <title>GraphQL API Документация</title>
          <style>
            body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
            h1 { color: #333; }
            pre { background-color: #f5f5f5; padding: 10px; border-radius: 5px; overflow-x: auto; }
            .endpoint { margin-bottom: 20px; }
            .query { font-weight: bold; margin-top: 10px; }
          </style>
        </head>
        <body>
          <h1>GraphQL API Документация</h1>
          <p>GraphQL эндпоинт доступен по адресу: <a href="/graphql">/graphql</a></p>
          
          <div class="endpoint">
            <h2>Доступные запросы:</h2>
            
            <div class="query">1. Получение всех товаров с полной информацией:</div>
            <pre>
query {
  products {
    id
    name
    price
    description
    category {
      id
      name
    }
  }
}
            </pre>
            
            <div class="query">2. Получение товара по ID:</div>
            <pre>
query {
  product(id: "1") {
    id
    name
    price
    description
  }
}
            </pre>
            
            <div class="query">3. Получение всех категорий:</div>
            <pre>
query {
  categories {
    id
    name
  }
}
            </pre>
            
            <div class="query">4. Получение товаров по категории:</div>
            <pre>
query {
  productsByCategory(categoryId: "1") {
    id
    name
    price
  }
}
            </pre>
            
            <div class="query">5. Получение только базовой информации о товарах (название и цена):</div>
            <pre>
query {
  productsBasicInfo {
    id
    name
    price
  }
}
            </pre>
            
            <div class="query">6. Получение товаров с детальным описанием:</div>
            <pre>
query {
  productsWithDetails {
    id
    name
    description
    category {
      name
    }
  }
}
            </pre>
          </div>
        </body>
      </html>
    `);
  });

  // Запуск сервера
  app.listen(PORT, () => {
    console.log(`GraphQL сервер запущен на порту ${PORT}`);
    console.log(`GraphQL Playground доступен по адресу: http://localhost:${PORT}/graphql`);
    console.log(`Документация API доступна по адресу: http://localhost:${PORT}/`);
  });
}

startApolloServer().catch(err => {
  console.error('Ошибка при запуске GraphQL сервера:', err);
});