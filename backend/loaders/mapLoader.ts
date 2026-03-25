import fs from 'fs';

export const loadMapFile = (filePath: string): string[][] => {
  const lines = fs.readFileSync(filePath, 'utf-8').trim().split(/\r?\n/);
  return lines.map(line => line.split(''));
};