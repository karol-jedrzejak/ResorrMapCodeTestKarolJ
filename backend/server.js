const yargs = require('yargs');
const { createApp } = require('./app');

const argv = yargs.argv;
const mapPath = argv.map || '../ResortMapCodeTest/map.ascii';
const bookingsPath = argv.bookings || '../ResortMapCodeTest/bookings.json';

const { app } = createApp({mapPath, bookingsPath});

const port = 3001;
app.listen(port, () => {
  console.log(`Backend running on port ${port}`);
});