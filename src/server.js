// src/server.js
import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { connectMongoDB } from './db/connectMongoDB.js';
import cookieParser from 'cookie-parser';

//import midleware handlers
import { errorHandler } from './middleware/errorHandler.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { logger } from './middleware/logger.js';

import notesRoutes from './routes/notesRoutes.js';
import authRoutes from './routes/authRoutes.js';

import { errors } from 'celebrate';

const app = express();
// Використовуємо значення з .env або дефолтний порт 3000
const PORT = Number(process.env.PORT) || 3000;

// Middleware для парсингу JSON
app.use(express.json());

// Middleware pino
app.use(logger);

// Дозволяє запити з будь-яких джерел
app.use(cors());

app.use(cookieParser());

app.use(authRoutes);
app.use(notesRoutes);

// Middleware 404 (після всіх маршрутів)
app.use(notFoundHandler);

// обробка помилок від celebrate (валідація)
app.use(errors());

// Middleware для обробки помилок (останнє)
app.use(errorHandler);

// підключення до MongoDB
await connectMongoDB();

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
