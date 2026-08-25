// src/server.js
import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { connectMongoDB } from './db/connectMongoDB.js';

//import midleware handlers
import { errorHandler } from './middleware/errorHandler.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { logger } from './middleware/logger.js';

import notesRoutes from './routes/notesRoutes.js';
const app = express();
// Використовуємо значення з .env або дефолтний порт 3000
const PORT = Number(process.env.PORT) || 3000;

// Middleware для парсингу JSON
app.use(express.json());

// Middleware pino
app.use(logger);

// Дозволяє запити з будь-яких джерел
app.use(cors());

app.use(notesRoutes);

//Тест помилки
app.get('/test-error', () => {
  throw new Error('Simulated server error');
});

// Middleware 404 (після всіх маршрутів)
app.use(notFoundHandler);

// Middleware для обробки помилок (останнє)
app.use(errorHandler);

// підключення до MongoDB
await connectMongoDB();

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
