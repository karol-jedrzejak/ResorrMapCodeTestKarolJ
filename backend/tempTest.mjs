import path from 'path';
import { createApp } from './app.js';
import request from 'supertest';

const mapPath = path.join(process.cwd(),'map.ascii');
const bookingsPath = path.join(process.cwd(),'bookings.json');
console.log('mapPath', mapPath);
console.log('bookingsPath', bookingsPath);

const app = createApp({mapPath, bookingsPath}).app;

const res = await request(app).get('/api/map');
console.log('status', res.status);
console.log('body', res.body?.length, typeof res.body);
console.log('err', res.error);
