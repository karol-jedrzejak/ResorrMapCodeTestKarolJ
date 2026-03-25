import type { Request, Response } from 'express';
import { MapService } from '../services/mapService.ts';

export const getMap = (req: Request, res: Response) => {
// Przekazujemy dynamiczne ścieżki z app.locals
  const mapService = new MapService(
    req.app.locals.mapPath!,
    req.app.locals.bookingsPath!
  );
  res.json(mapService.getMap());
};

export const bookCabana = (req: Request, res: Response) => {
  const { row, col, room, guestName } = req.body;
  try {
    const mapService = new MapService(
      req.app.locals.mapPath!,
      req.app.locals.bookingsPath!
    );
    const cell = mapService.bookCabana({ row, col, room, guestName });
    res.json(cell);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
}; 