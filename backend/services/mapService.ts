import type { Cell } from '../models/types.ts';
import { loadMapFromFile } from '../loaders/mapLoader.ts';
import { loadBookings } from '../loaders/bookingLoader.ts';

export class MapService {
  private mapPath: string;
  private bookingsPath: string;
  private mapCache: Cell[][] | null = null;

  constructor(mapPath: string, bookingsPath: string) {
    this.mapPath = mapPath;
    this.bookingsPath = bookingsPath;
  }

  getMap(): Cell[][] {
    if (!this.mapCache) {
      this.mapCache = loadMapFromFile(this.mapPath);
    }
    return this.mapCache;
  }

  bookCabana({
    row,
    col,
    room,
    guestName
  }: {
    row: number;
    col: number;
    room: string;
    guestName: string;
  }): Cell {
    const map = this.getMap();
    const cell = map[row]?.[col];

    if (!cell) throw new Error('Invalid position');
    if (cell.type !== 'W') throw new Error('Not a cabana');
    if (cell.occupied) throw new Error('Already occupied');

    const bookings = loadBookings(this.bookingsPath);

    const validGuest = bookings.find(
      b => b.room === room && b.guestName === guestName
    );

    if (!validGuest) throw new Error('Guest not found in booking list');

    const alreadyAssigned = map.some(r =>
      r.some(c => c.guestName === guestName)
    );

    if (alreadyAssigned) throw new Error('Guest already has a cabana');

    cell.occupied = true;
    cell.guestName = guestName;

    return cell;
  }

  
}
