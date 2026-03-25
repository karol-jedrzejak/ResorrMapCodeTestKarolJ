import { getNeighbors } from './getNeighbors.ts';
import { getRoadInfo } from './getRoadInfo.ts';

export const parseCell = (char: string, mapChars: string[][], i: number, j: number) => {
  let shape = null;
  let rotation = 0;

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