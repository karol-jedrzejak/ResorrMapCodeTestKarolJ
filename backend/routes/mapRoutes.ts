import { Router } from 'express';
import { MapService } from '../services/mapService.ts';

const router = Router();

router.get('/map', (req, res) => {
  // Przekazujemy dynamiczne ścieżki z app.locals
  const mapService = new MapService(
    req.app.locals.mapPath!,
    req.app.locals.bookingsPath!
  );
  res.json(mapService.getMap());
});

router.post('/book', (req, res) => {
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
});

export default router;
