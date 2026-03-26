import { MapService } from '../../services/mapService';
import path from 'path';
import { fileURLToPath } from 'url';
import { getCachedMap, clearMapCache } from '../../cache/map.cache';
import { clearBookingsCache } from '../../cache/booking.cache';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('MapService - Integration with real files', () => {
  const root = path.join(__dirname, '../../..');
  const mapPath = path.join(root, 'ResortMapCodeTest', 'map.ascii');
  const bookingsPath = path.join(root, 'ResortMapCodeTest', 'bookings.json');

  beforeEach(() => {
    clearMapCache();
    clearBookingsCache();
  });

  it('loads the map and caches it', () => {
    const service = new MapService(mapPath, bookingsPath);
    const mapData = service.getMap();

    expect(Array.isArray(mapData)).toBe(true);
    expect(mapData.length).toBeGreaterThan(0);

    const cached = getCachedMap(mapPath);
    expect(cached).toEqual(mapData);
  });

  it('books a free cabana and persists state', () => {
    const service = new MapService(mapPath, bookingsPath);
    const mapData = service.getMap();

    const candidate = mapData.flat().find(cell => cell.type === 'W' && !cell.occupied);
    expect(candidate).toBeDefined();
    if (!candidate) throw new Error('Test setup failure: no free cabana found');

    const row = mapData.findIndex(r => r.includes(candidate as any));
    const col = mapData[row].indexOf(candidate as any);

    const result = service.bookCabana({ row, col, room: '101', guestName: 'Alice Smith' });

    expect(result.occupied).toBe(true);
    expect(result.guestName).toBe('Alice Smith');

    const updatedMap = service.getMap();
    expect(updatedMap[row][col].occupied).toBe(true);
    expect(updatedMap[row][col].guestName).toBe('Alice Smith');
  });

  it('releases previous booking for same guest', () => {
    const service = new MapService(mapPath, bookingsPath);
    const mapData = service.getMap();
    const freeCabanaCells = mapData.flat().filter(c => c.type === 'W' && !c.occupied);

    expect(freeCabanaCells.length).toBeGreaterThan(1);

    const firstCell = freeCabanaCells[0];
    const secondCell = freeCabanaCells[1];
    const row1 = mapData.findIndex(r => r.includes(firstCell));
    const col1 = mapData[row1].indexOf(firstCell);
    const row2 = mapData.findIndex(r => r.includes(secondCell));
    const col2 = mapData[row2].indexOf(secondCell);

    service.bookCabana({ row: row1, col: col1, room: '101', guestName: 'Alice Smith' });
    service.bookCabana({ row: row2, col: col2, room: '101', guestName: 'Alice Smith' });

    const refreshed = service.getMap();
    expect(refreshed[row1][col1].occupied).toBe(false);
    expect(refreshed[row1][col1].guestName).toBeNull();
    expect(refreshed[row2][col2].occupied).toBe(true);
    expect(refreshed[row2][col2].guestName).toBe('Alice Smith');
  });

  it('throws on invalid position', () => {
    const service = new MapService(mapPath, bookingsPath);
    expect(() => service.bookCabana({ row: 999, col: 999, room: '101', guestName: 'Alice Smith' })).toThrow('Invalid position');
  });

  it('throws when booking non-cabana cell', () => {
    const service = new MapService(mapPath, bookingsPath);
    const mapData = service.getMap();
    const nonCabana = mapData.flat().find(c => c.type !== 'W');
    expect(nonCabana).toBeDefined();
    if (!nonCabana) throw new Error('Test setup failure: no non-cabana cell found');

    const row = mapData.findIndex(r => r.includes(nonCabana as any));
    const col = mapData[row].indexOf(nonCabana as any);

    expect(() => service.bookCabana({ row, col, room: '101', guestName: 'Alice Smith' })).toThrow('Not a cabana');
  });
});
