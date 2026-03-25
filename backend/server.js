import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { createApp } from './app.js';

const argv = yargs(hideBin(process.argv)).argv;

// Domyślne ścieżki
const mapPath = argv.map || '../ResortMapCodeTest/map.ascii';
const bookingsPath = argv.bookings || '../ResortMapCodeTest/bookings.json';

const { app } = createApp({ mapPath, bookingsPath });

const port = 3001;
app.listen(port, () => {
  console.log(`Backend running on port ${port}`);
  console.log(`Map path: ${mapPath}`);
  console.log(`Bookings path: ${bookingsPath}`);
});


/* const yargs = require('yargs');
const { createApp } = require('./app');

const argv = yargs.argv;
const mapPath = argv.map || '../ResortMapCodeTest/map.ascii';
const bookingsPath = argv.bookings || '../ResortMapCodeTest/bookings.json';

const { app } = createApp({mapPath, bookingsPath});

const port = 3001;
app.listen(port, () => {
  console.log(`Backend running on port ${port}`);
}); */