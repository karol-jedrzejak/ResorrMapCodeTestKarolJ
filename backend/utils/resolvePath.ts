import path from 'path';
import fs from 'fs';

export const resolveDataPath = (fileName: string): string => {
  const backendPath = path.join(__dirname, '../data', fileName);
  const rootPath = path.join(process.cwd(), 'data', fileName);

  if (fs.existsSync(backendPath)) return backendPath;
  if (fs.existsSync(rootPath)) return rootPath;

  throw new Error(`File ${fileName} not found in backend/data or root/data`);
};