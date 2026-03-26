import express from 'express';
import cors from 'cors';
import mapRoutes from './routes/mapRoutes.ts';

export function createApp({ mapPath, bookingsPath }) {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.locals.mapPath = mapPath;
  app.locals.bookingsPath = bookingsPath;

  app.use('/api', mapRoutes);

  return { app };
}