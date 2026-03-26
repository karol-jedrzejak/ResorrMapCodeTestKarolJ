import request from 'supertest';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('Cabana Booking API - Integration Tests', () => {
  let app: any;
  const testDataDir = path.join(__dirname, '../..');

  beforeEach(async () => {
    // @ts-ignore
    const { createApp } = await import('../app.js');
    const mapPath = path.join(testDataDir, 'map.ascii');
    const bookingsPath = path.join(testDataDir, 'bookings.json');
    app = createApp({ mapPath, bookingsPath }).app;
  });

  describe('GET /api/map', () => {
    it('should return the map as a 2D array', async () => {
      // ACT
      const res = await request(app).get('/api/map');

      // ASSERT
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);
    });

    it('should return cells with required properties', async () => {
      // ACT
      const res = await request(app).get('/api/map');

      // ASSERT
      expect(res.status).toBe(200);
      const cell = res.body[0][0];
      expect(cell).toHaveProperty('type');
      expect(cell).toHaveProperty('occupied');
      expect(cell).toHaveProperty('shape');
      expect(cell).toHaveProperty('rotation');
      expect(cell).toHaveProperty('guestName');
    });

    it('should return cabana cells (W type) as unoccupied initially', async () => {
      // ACT
      const res = await request(app).get('/api/map');

      // ASSERT
      const cabanaCells = res.body
        .flat()
        .filter((cell: any) => cell.type === 'W');
      
      expect(cabanaCells.length).toBeGreaterThan(0);
      cabanaCells.forEach((cell: any) => {
        expect(cell.occupied).toBe(false);
        expect(cell.guestName).toBeNull();
      });
    });
  });

  describe('POST /api/book', () => {
    it('should successfully book an available cabana', async () => {
      // ARRANGE - get the map first to find an available cabana
      const mapRes = await request(app).get('/api/map');
      const availableCabana = mapRes.body
        .map((row: any[], i: number) => ({
          row: i,
          cells: row.map((cell: any, j: number) => ({ ...cell, col: j }))
        }))
        .flatMap((r: any) => r.cells.map((c: any) => ({ ...c, row: r.row })))
        .find((cell: any) => cell.type === 'W' && !cell.occupied);

      // ACT
      const bookRes = await request(app)
        .post('/api/book')
        .send({
          row: availableCabana.row,
          col: availableCabana.col,
          room: '101',
          guestName: 'Alice Smith'
        });

      // ASSERT
      expect(bookRes.status).toBe(200);
      expect(bookRes.body.occupied).toBe(true);
      expect(bookRes.body.guestName).toBe('Alice Smith');
    });

    it('should reject booking with invalid room number', async () => {
      // ARRANGE
      const mapRes = await request(app).get('/api/map');
      const availableCabana = mapRes.body
        .map((row: any[], i: number) => ({
          row: i,
          cells: row.map((cell: any, j: number) => ({ ...cell, col: j }))
        }))
        .flatMap((r: any) => r.cells.map((c: any) => ({ ...c, row: r.row })))
        .find((cell: any) => cell.type === 'W' && !cell.occupied);

      // ACT
      const bookRes = await request(app)
        .post('/api/book')
        .send({
          row: availableCabana.row,
          col: availableCabana.col,
          room: '999',
          guestName: 'Unknown Guest'
        });

      // ASSERT
      expect(bookRes.status).toBe(400);
      expect(bookRes.body.error).toBeDefined();
    });

    it('should reject booking out of bounds position', async () => {
      // ACT
      const bookRes = await request(app)
        .post('/api/book')
        .send({
          row: 999,
          col: 999,
          room: '101',
          guestName: 'Alice'
        });

      // ASSERT
      expect(bookRes.status).toBe(400);
      expect(bookRes.body.error).toMatch(/Invalid position/i);
    });

    it('should reject booking non-cabana cells', async () => {
      // ARRANGE - find a non-W cell (like road or pool)
      const mapRes = await request(app).get('/api/map');
      const nonCabannaCell = mapRes.body
        .map((row: any[], i: number) => ({
          row: i,
          cells: row.map((cell: any, j: number) => ({ ...cell, col: j }))
        }))
        .flatMap((r: any) => r.cells.map((c: any) => ({ ...c, row: r.row })))
        .find((cell: any) => cell.type !== 'W');

      // ACT
      const bookRes = await request(app)
        .post('/api/book')
        .send({
          row: nonCabannaCell.row,
          col: nonCabannaCell.col,
          room: '101',
          guestName: 'Alice'
        });

      // ASSERT
      expect(bookRes.status).toBe(400);
      expect(bookRes.body.error).toMatch(/Not a cabana/i);
    });

    it('should free previous cabana when guest books new one', async () => {
      // ARRANGE - find 2 available cabanas
      const mapRes = await request(app).get('/api/map');
      const availableCabanas = mapRes.body
        .map((row: any[], i: number) => ({
          row: i,
          cells: row.map((cell: any, j: number) => ({ ...cell, col: j }))
        }))
        .flatMap((r: any) => r.cells.map((c: any) => ({ ...c, row: r.row })))
        .filter((cell: any) => cell.type === 'W' && !cell.occupied)
        .slice(0, 2);

      // ACT - book first cabana
      await request(app)
        .post('/api/book')
        .send({
          row: availableCabanas[0].row,
          col: availableCabanas[0].col,
          room: '101',
          guestName: 'Alice Smith'
        });

      // ACT - book second cabana with same guest
      const bookRes2 = await request(app)
        .post('/api/book')
        .send({
          row: availableCabanas[1].row,
          col: availableCabanas[1].col,
          room: '101',
          guestName: 'Alice Smith'
        });

      // ASSERT - second booking succeeds
      expect(bookRes2.status).toBe(200);

      // ASSERT - first cabana is now free
      const finalMapRes = await request(app).get('/api/map');
      const firstCabana = finalMapRes.body[availableCabanas[0].row][availableCabanas[0].col];
      expect(firstCabana.occupied).toBe(false);
      expect(firstCabana.guestName).toBeNull();

      // ASSERT - second cabana is occupied
      const secondCabana = finalMapRes.body[availableCabanas[1].row][availableCabanas[1].col];
      expect(secondCabana.occupied).toBe(true);
      expect(secondCabana.guestName).toBe('Alice Smith');
    });
  });
});
