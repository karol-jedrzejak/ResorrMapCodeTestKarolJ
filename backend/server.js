const express = require('express');
const cors = require('cors');
const fs = require('fs');
const yargs = require('yargs');

const argv = yargs.argv;
const mapPath = argv.map || '../ResortMapCodeTest/map.ascii';
const bookingsPath = argv.bookings || '../ResortMapCodeTest/bookings.json';

const mapData = fs.readFileSync(mapPath, 'utf8').trim().split('\n').map(line => line.split(''));
const bookings = JSON.parse(fs.readFileSync(bookingsPath, 'utf8'));

function getNeighbors(map, i, j) {
  const rows = map.length;
  const cols = map[0].length;
  return {
    up: i > 0 && map[i-1][j] === '#',
    down: i < rows-1 && map[i+1][j] === '#',
    left: j > 0 && map[i][j-1] === '#',
    right: j < cols-1 && map[i][j+1] === '#'
  };
}

function getRoadInfo(neighbors) {
  const {up, down, left, right} = neighbors;
  const connected = [up, down, left, right].filter(Boolean).length;

  let shape = 'end';
  let rotation = 0;

  if (connected === 1) {
    // End piece: rotate so the road points toward the single neighbor.
    shape = 'end';
    if (up) rotation = 180;
    else if (right) rotation = 270;
    else if (down) rotation = 0;
    else if (left) rotation = 90;
  } else if (connected === 2) {
    // Straight or corner.
    if (up && down) {
      shape = 'straight';
      rotation = 0;
    } else if (left && right) {
      shape = 'straight';
      rotation = 90;
    } else {
      shape = 'corner';
      if (up && right) rotation = 0;
      else if (right && down) rotation = 90;
      else if (down && left) rotation = 180;
      else if (left && up) rotation = 270;
    }
  } else if (connected === 3) {
    // T junction: rotate so the missing direction is the "stem" of the T.
    shape = 't';
    if (!down) rotation = 270;   // missing down
    else if (!left) rotation = 0;  // missing left
    else if (!up) rotation = 90;   // missing up
    else if (!right) rotation = 180; // missing right
  } else if (connected === 4) {
    shape = 'cross';
    rotation = 0;
  }

  return {shape, rotation};
}

const matrix = mapData.map((row, i) => row.map((cell, j) => {
  const obj = {type: cell, occupied: false, shape: null, rotation: 0, guestName: null};
  if (cell === '#') {
    const neighbors = getNeighbors(mapData, i, j);
    const roadInfo = getRoadInfo(neighbors);
    obj.shape = roadInfo.shape;
    obj.rotation = roadInfo.rotation;
  }
  return obj;
}));

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/map', (req, res) => {
  res.json(matrix);
});

app.post('/api/book', (req, res) => {
  const {row, col, room, guestName} = req.body;
  const guest = bookings.find(b => b.room === room && b.guestName === guestName);
  if (!guest) {
    return res.status(400).json({error: 'Invalid room number or guest name'});
  }
  if (row < 0 || row >= matrix.length || col < 0 || col >= matrix[0].length) {
    return res.status(400).json({error: 'Invalid position'});
  }
  const cell = matrix[row][col];
  if (cell.type !== 'W') {
    return res.status(400).json({error: 'Not a lounge chair'});
  }
  if (cell.occupied) {
    return res.status(400).json({error: 'Chair is already occupied'});
  }
  // Check if guest already has a booking and free it
  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[i].length; j++) {
      if (matrix[i][j].guestName === guestName) {
        matrix[i][j].occupied = false;
        matrix[i][j].guestName = null;
        break;
      }
    }
  }
  cell.occupied = true;
  cell.guestName = guestName;
  res.json({message: 'Booking successful'});
});

const port = 3001;
app.listen(port, () => {
  console.log(`Backend running on port ${port}`);
});