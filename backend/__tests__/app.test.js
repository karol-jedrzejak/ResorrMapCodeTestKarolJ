const request = require('supertest');
const path = require('path');
const { createApp } = require('../app');

const mapPath = path.join(__dirname, '..', '..', 'map.ascii');
const bookingsPath = path.join(__dirname, '..', '..', 'bookings.json');

describe('Backend API', () => {
  let appWrapper;

  beforeEach(() => {
    appWrapper = createApp({mapPath, bookingsPath});
  });

  test('GET /api/map returns matrix structure', async () => {
    const res = await request(appWrapper.app).get('/api/map');

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0][0]).toHaveProperty('type');
    expect(res.body[0][0]).toHaveProperty('occupied');
  });

  test('POST /api/book reserves a chair and updates map', async () => {
    // Coordinates from map.ascii (first available W at row 11, col 3)
    const row = 11;
    const col = 3;
    const room = '101';
    const guestName = 'Alice Smith';

    const bookRes = await request(appWrapper.app)
      .post('/api/book')
      .send({row, col, room, guestName});

    expect(bookRes.status).toBe(200);
    expect(bookRes.body.message).toBe('Booking successful');

    const mapRes = await request(appWrapper.app).get('/api/map');
    expect(mapRes.body[row][col].occupied).toBe(true);
    expect(mapRes.body[row][col].guestName).toBe(guestName);

    // Booking another chair should free the previous one
    const newRow = 11;
    const newCol = 4; // next chair
    const bookRes2 = await request(appWrapper.app)
      .post('/api/book')
      .send({row: newRow, col: newCol, room, guestName});

    expect(bookRes2.status).toBe(200);

    const mapRes2 = await request(appWrapper.app).get('/api/map');
    expect(mapRes2.body[row][col].occupied).toBe(false);
    expect(mapRes2.body[newRow][newCol].occupied).toBe(true);
    expect(mapRes2.body[newRow][newCol].guestName).toBe(guestName);
  });

  test('POST /api/book rejects invalid guest info', async () => {
    const res = await request(appWrapper.app)
      .post('/api/book')
      .send({row: 11, col: 3, room: '999', guestName: 'No One'});

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/Invalid room number/i);
  });

  test('POST /api/book rejects invalid position or non-W cell', async () => {
    // Position outside map
    const resOutOfBounds = await request(appWrapper.app)
      .post('/api/book')
      .send({row: -1, col: -1, room: '101', guestName: 'Alice Smith'});

    expect(resOutOfBounds.status).toBe(400);
    expect(resOutOfBounds.body.error).toMatch(/Invalid position/i);

    // Non-W cell (road character)
    const resNonW = await request(appWrapper.app)
      .post('/api/book')
      .send({row: 2, col: 2, room: '101', guestName: 'Alice Smith'});

    expect(resNonW.status).toBe(400);
    expect(resNonW.body.error).toMatch(/Not a lounge chair/i);
  });
});
