import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import dns from 'dns';

import { connectMongoDB } from './db/connectMongoDB.js';
import { logger } from './middleware/logger.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { errorHandler } from './middleware/errorHandler.js';
import apiRouter from './routes/index.js';

const app = express();
const PORT = Number(process.env.PORT) || 4000;

const allowedOrigins = (process.env.FRONTEND_URLS ?? '')
  .split(',')
  .map((url) => url.trim())
  .filter(Boolean);

app.use(logger);
app.use(helmet());
app.use(
  cors({
    // запити без Origin (Postman, server-to-server з Next route handlers) пропускаємо
    origin: (origin, cb) =>
      !origin || allowedOrigins.includes(origin)
        ? cb(null, true)
        : cb(new Error(`CORS: origin ${origin} is not allowed`)),
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

app.get('/api/health', (_req, res) => {
  res.status(200).json({ data: { status: 'ok' } });
});

app.use('/api', apiRouter);

app.use(notFoundHandler);
app.use(errorHandler);

dns.setServers(['1.1.1.1', '8.8.8.8']);

await connectMongoDB();

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
