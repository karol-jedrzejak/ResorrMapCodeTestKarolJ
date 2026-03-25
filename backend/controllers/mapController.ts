import type { Request, Response } from 'express';
import * as mapService from '../services/mapService.ts';


export const getMap = (req: Request, res: Response) => {
  const map = mapService.getMap();
  res.json(map);
};

export const bookCabana = (req: Request, res: Response) => {
  try {
    const { row, col, room, guestName } = req.body;

    const result = mapService.bookCabana({
      row,
      col,
      room,
      guestName
    });

    res.json({ message: 'Booking successful', data: result });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
}; 