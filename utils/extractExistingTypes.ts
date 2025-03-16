import fs from 'fs';
import { promisify } from 'util';
import { extractTypesFromContent } from './extractTypesFromContent';

const readFileAsync = promisify(fs.readFile);

export async function extractExistingTypes(files: string[]): Promise<Map<string, string>> {
  const typeMap = new Map<string, string>();
  
  for (const file of files) {
    try {
      const content = await readFileAsync(file, 'utf8');
      const fileTypes = extractTypesFromContent(content);
      
      for (const [typeName, typeDefinition] of fileTypes.entries()) {
        typeMap.set(typeName, typeDefinition);
      }
    } catch (err) {
      console.error(`Error reading file ${file}:`, err);
    }
  }
  
  return typeMap;
} 