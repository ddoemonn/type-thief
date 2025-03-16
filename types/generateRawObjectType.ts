import { generateType } from './generateType';

export function generateRawObjectType(
  obj: Record<string, unknown>,
  existingTypes: Map<string, string> = new Map()
): string {
  const properties = Object.entries(obj).map(([key, value]) => {
    const valueType = generateType(value, existingTypes);
    return `${key}: ${valueType}`;
  });
  
  return `{
  ${properties.join(';\n  ')}
}`;
} 