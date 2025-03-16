import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import { generateTypeDefinition } from './generateTypeDefinition';
import { getTypeFiles } from '../utils/getTypeFiles';
import { extractExistingTypes } from '../utils/extractExistingTypes';
import { extractTypesFromContent } from '../utils/extractTypesFromContent';

const writeFileAsync = promisify(fs.writeFile);
const mkdirAsync = promisify(fs.mkdir);
const readFileAsync = promisify(fs.readFile);
const existsAsync = promisify(fs.exists);

export async function thief<T>(
  data: T, 
  options: { 
    typeName?: string, 
    outputDir?: string,
    fileName?: string,
    debug?: boolean
  } = {}
): Promise<void> {
  const typeName = options.typeName || 'GeneratedType';
  const outputDir = options.outputDir || 'types';
  const fileName = options.fileName || 'generated.ts';
  const debug = options.debug || false;
  
  try {
    await mkdirAsync(outputDir, { recursive: true });
  } catch (err) {
    console.log(err);
  }
  
  const filePath = path.join(outputDir, fileName);
  
  const typeFiles = await getTypeFiles(outputDir);
  const existingTypes = await extractExistingTypes(typeFiles);
  
  if (debug) {
    console.log(`Found ${existingTypes.size} existing types:`);
    for (const [typeName, definition] of existingTypes.entries()) {
      console.log(`- ${typeName}: ${definition.substring(0, 50)}${definition.length > 50 ? '...' : ''}`);
    }
  }
  
  const fileExists = await existsAsync(filePath);
  let existingContent = '';
  
  if (fileExists) {
    try {
      existingContent = await readFileAsync(filePath, 'utf8');
      
      const currentFileTypes = extractTypesFromContent(existingContent);
      
      if (debug) {
        console.log(`Found ${currentFileTypes.size} types in current file:`);
        for (const [typeName, definition] of currentFileTypes.entries()) {
          console.log(`- ${typeName}: ${definition.substring(0, 50)}${definition.length > 50 ? '...' : ''}`);
        }
      }
      
      for (const [name, typeDefinition] of currentFileTypes.entries()) {
        existingTypes.set(name, typeDefinition);
      }
      
      if (currentFileTypes.has(typeName)) {
        console.log(`Type ${typeName} already exists in ${filePath}. Skipping.`);
        return;
      }
    } catch (err) {
      console.error(`Error reading file ${filePath}:`, err);
    }
  }
  
  const typeDefinition = generateTypeDefinition(data, typeName, existingTypes, debug);
  
  let fileContent;
  if (fileExists && existingContent) {
    const contentWithoutTrailingComment = existingContent.trim().replace(/\/\/\s*Auto-generated types by thief\s*$/, '');
    
    fileContent = contentWithoutTrailingComment + '\n\n' + typeDefinition;
  } else {
    fileContent = typeDefinition;
  }
  
  await writeFileAsync(filePath, fileContent, 'utf8');
  console.log(`Type definition written to ${filePath}`);
} 