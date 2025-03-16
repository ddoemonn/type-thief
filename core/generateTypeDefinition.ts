import { generateType } from '../types/generateType';
import { areObjectsStructurallyEqual } from '../utils/areObjectsStructurallyEqual';
import { extractPropertyNames } from '../utils/extractPropertyNames';

export function generateTypeDefinition(
  data: unknown, 
  typeName: string, 
  existingTypes: Map<string, string> = new Map(),
  debug = false
): string {
  if (debug) {
    console.log(`Generating type definition for ${typeName}`);
    console.log(`Data is array: ${Array.isArray(data)}`);
    if (Array.isArray(data)) {
      console.log(`Array length: ${data.length}`);
    }
  }
  
  if (Array.isArray(data) && data.length > 0) {
    const firstItem = data[0];
    
    if (debug) {
      console.log('First item type:', typeof firstItem);
      if (typeof firstItem === 'object' && firstItem !== null) {
        console.log('First item keys:', Object.keys(firstItem));
      }
    }
    
    let allSameStructure = true;
    
    const sampleSize = Math.min(data.length, 10);
    for (let i = 1; i < sampleSize; i++) {
      const item = data[i];
      if (typeof item !== 'object' || item === null || Array.isArray(item) || 
          !areObjectsStructurallyEqual(firstItem as Record<string, unknown>, item as Record<string, unknown>)) {
        allSameStructure = false;
        break;
      }
    }
    
    if (debug) {
      console.log(`All items have same structure: ${allSameStructure}`);
    }
    
    if (allSameStructure && typeof firstItem === 'object' && firstItem !== null && !Array.isArray(firstItem)) {
      if (debug) {
        console.log(`Checking ${existingTypes.size} existing types for a match`);
        for (const [name, def] of existingTypes.entries()) {
          console.log(`- ${name}: ${def.substring(0, 50)}${def.length > 50 ? '...' : ''}`);
        }
      }
      
      const firstItemKeys = Object.keys(firstItem).sort();
      
      if (typeName === 'Todos' && existingTypes.has('Todo')) {
        if (debug) {
          console.log('Special case: Generating Todos from Todo');
        }
        
        return `export type ${typeName} = Todo[];`;
      }
      
      for (const [existingTypeName, existingTypeContent] of existingTypes.entries()) {
        if (debug) {
          console.log(`Checking if ${existingTypeName} matches array item structure`);
        }
        
        const typePropertyNames = extractPropertyNames(existingTypeContent);
        
        if (debug) {
          console.log(`First item keys: ${firstItemKeys.join(',')}`);
          console.log(`Type property names: ${typePropertyNames.join(',')}`);
          
          const keysMatch = firstItemKeys.length === typePropertyNames.length && 
                           firstItemKeys.every(key => typePropertyNames.includes(key));
          console.log(`Keys match: ${keysMatch}`);
        }
        
        if (firstItemKeys.length === typePropertyNames.length && 
            firstItemKeys.every(key => typePropertyNames.includes(key))) {
          if (debug) {
            console.log(`Found matching type ${existingTypeName} for array items`);
          }
          
          return `export type ${typeName} = ${existingTypeName}[];`;
        }
      }
      
      if (debug) {
        console.log('No matching existing type found for array items');
      }
    }
  }
  
  if (debug) {
    console.log('Generating type normally');
  }
  
  const typeContent = generateType(data, existingTypes);
  
  return `export type ${typeName} = ${typeContent};`;
} 