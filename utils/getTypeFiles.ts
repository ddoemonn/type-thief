import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

export async function getTypeFiles(dir: string): Promise<string[]> {
  try {
    const files = await promisify(fs.readdir)(dir);
    return files
      .filter(file => file.endsWith('.ts'))
      .map(file => path.join(dir, file));
  } catch (err) {
    console.error('Error reading directory:', err);
    return [];
  }
} 