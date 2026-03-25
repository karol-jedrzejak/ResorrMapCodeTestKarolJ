import type { Cell } from '../models/types';

let cache: Cell[][] | null = null;
let cacheFilePath: string | null = null;

export const getCachedMap = (filePath: string) => {
  if (cacheFilePath === filePath) return cache;
  return null;
};

export const setCachedMap = (filePath: string, data: Cell[][]) => {
  cache = data;
  cacheFilePath = filePath;
};