import { parseCell } from './parseCell.ts';

export const parseMap = (mapChars: string[][]) => {
  return mapChars.map((row, i) =>
    row.map((char, j) => parseCell(char, mapChars, i, j))
  );
};