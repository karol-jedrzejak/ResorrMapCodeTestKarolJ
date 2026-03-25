import type { Cell } from '../models/types.ts';
import { loadMapFile } from '../loaders/mapLoader.ts';
import { parseMap } from '../utils/parseMap.ts';
import { getCachedMap, setCachedMap } from '../cache/map.cache.ts';
import {
  getCachedBookings,
  setCachedBookings
} from '../cache/booking.cache.ts';
import { loadBookings } from '../loaders/bookingLoader.ts';

export class MapService {
  private mapPath: string;
  private bookingsPath: string;
  private mapCache: Cell[][] | null = null;

  constructor(mapPath: string, bookingsPath: string) {
    this.mapPath = mapPath;
    this.bookingsPath = bookingsPath;
  }

  private getBookings() {
    const cached = getCachedBookings(this.bookingsPath);
    if (cached) return cached;

    const bookings = loadBookings(this.bookingsPath);
    setCachedBookings(this.bookingsPath, bookings);

    return bookings;
  }

  getMap(): Cell[][] {
    const cached = getCachedMap(this.mapPath);
    if (cached) return cached;

    const rawMap = loadMapFile(this.mapPath);
    const parsed = parseMap(rawMap);

    setCachedMap(this.mapPath, parsed);
    return parsed;
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

    const bookings = this.getBookings();

    const validGuest = bookings.find(
      b => b.room === room && b.guestName === guestName
    );

    if (!validGuest) throw new Error('Guest not found in booking list');


  // 🔥 NOWA LOGIKA – znajdź i zwolnij poprzednią kabinę
  for (const r of map) {
    for (const c of r) {
      if (c.guestName === guestName) {
        c.occupied = false;
        c.guestName = null;
      }
    }
  }

/*     const alreadyAssigned = map.some(r =>
      r.some(c => c.guestName === guestName)
    );

    if (alreadyAssigned) throw new Error('Guest already has a cabana'); */

    cell.occupied = true;
    cell.guestName = guestName;

    return cell;
  }

  
}
