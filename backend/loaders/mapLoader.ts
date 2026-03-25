// loadMap.ts
import fs from 'fs';
import type { Cell } from '../models/types.ts';

let cache: Cell[][] | null = null;
let cacheFilePath: string | null = null;

export const loadMapFromFile = (filePath: string): Cell[][] => {
  if (!cache || cacheFilePath !== filePath) {
    const lines = fs.readFileSync(filePath, 'utf-8').trim().split('\n');
    const mapChars = lines.map(line => line.split(''));
    const rows = mapChars.length;
    const cols = mapChars[0].length;

    cache = mapChars.map((rowChars, i) =>
      rowChars.map((char, j) => parseCell(char, mapChars, i, j))
    );

    cacheFilePath = filePath;
  }
  return cache;
};

const parseCell = (char: string, mapChars: string[][], i: number, j: number): Cell => {
  let shape: Cell['shape'] = null;
  let rotation = 0;

  // Jeśli komórka jest drogą '#', obliczamy kształt i rotację
  if (char === '#') {
    const neighbors = getNeighbors(mapChars, i, j);
    ({ shape, rotation } = getRoadInfo(neighbors));
  }

  return {
    type: char,
    occupied: false,
    shape,
    rotation,
    guestName: null
  };
};

// Sprawdzenie sąsiadów komórki (up, down, left, right)
function getNeighbors(map: string[][], i: number, j: number) {
  const rows = map.length;
  const cols = map[0].length;
  return {
    up: i > 0 && map[i - 1][j] === '#',
    down: i < rows - 1 && map[i + 1][j] === '#',
    left: j > 0 && map[i][j - 1] === '#',
    right: j < cols - 1 && map[i][j + 1] === '#'
  };
}

// Obliczenie shape i rotation na podstawie sąsiadów
function getRoadInfo(neighbors: { up: boolean; down: boolean; left: boolean; right: boolean }) {
  const { up, down, left, right } = neighbors;
  const connected = [up, down, left, right].filter(Boolean).length;

  let shape: Cell['shape'] = 'end';
  let rotation = 0;

  if (connected === 1) {
    if (up) rotation = 180;
    else if (right) rotation = 270;
    else if (down) rotation = 0;
    else if (left) rotation = 90;
  } else if (connected === 2) {
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
    shape = 't';
    if (!down) rotation = 270;
    else if (!left) rotation = 0;
    else if (!up) rotation = 90;
    else if (!right) rotation = 180;
  } else if (connected === 4) {
    shape = 'cross';
    rotation = 0;
  }

  return { shape, rotation };
}