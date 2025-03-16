import { generateRawObjectType } from './generateRawObjectType';

export function generateObjectType(
  obj: Record<string, unknown>,
  existingTypes: Map<string, string> = new Map()
): string {
  if (Object.keys(obj).length === 0) {
    return 'Record<string, never>';
  }
  
  return generateRawObjectType(obj, existingTypes);
} 