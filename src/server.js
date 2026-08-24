// src/server.js
import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import 'dotenv/config';

const app = express();
// Використовуємо значення з .env або дефолтний порт 3000
const PORT = process.env.PORT ?? 3000;

// Middleware для парсингу JSON
app.use(express.json());

// Middleware pino
app.use(
  pino({
    level: 'info',
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'HH:MM:ss',
        ignore: 'pid,hostname',
        messageFormat:
          '{req.method} {req.url} {res.statusCode} - {responseTime}ms',
        hideObject: true,
      },
    },
  }),
);

// Дозволяє запити з будь-яких джерел
app.use(cors());

// Get notes
app.get('/notes', (req, res) => {
  res.status(200).json({ message: 'Retrieved all notes' });
});

// Конкретна нотатка за id
app.get('/notes/:noteId', (req, res) => {
  const { noteId } = req.params;
  res.status(200).json({ message: `Retrieved note with ID: ${noteId}` });
});

//Тест помилки
app.get('/test-error', () => {
  throw new Error('Simulated server error');
});

// Middleware 404 (після всіх маршрутів)
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Middleware для обробки помилок (останнє)
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({
    message: err.message,
  });
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
