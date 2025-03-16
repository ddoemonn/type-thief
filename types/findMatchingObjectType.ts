import { structurallyCompatible } from './structurallyCompatible';

export function findMatchingObjectType(
  obj: Record<string, unknown>,
  existingTypes: Map<string, string>
): string | null {
  for (const [typeName, typeDefinition] of existingTypes.entries()) {
    if (typeDefinition.includes('{') && typeDefinition.includes('}')) {
      try {
        if (structurallyCompatible(obj, typeDefinition)) {
          return typeName;
        }
      } catch (err) {
        console.error(`Error checking structural compatibility with ${typeName}:`, err);
      }
    }
  }
  
  return null;
} 