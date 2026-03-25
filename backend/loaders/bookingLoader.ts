import fs from 'fs';
export interface Booking {
  room: string;
  guestName: string;
}

let cache: Booking[] | null = null;

export const loadBookings = (filePath: string): Booking[] => {
  if (!cache || cacheFilePath !== filePath) {
    const file = fs.readFileSync(filePath, 'utf-8');
    cache = JSON.parse(file) as Booking[];
    cacheFilePath = filePath;
  }
  return cache;
};

// pamiętamy, z którego pliku jest cache
let cacheFilePath: string | null = null;