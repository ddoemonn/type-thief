import { findMatchingObjectType } from './findMatchingObjectType';
import { generateObjectType } from './generateObjectType';

export function generateType(data: unknown, existingTypes: Map<string, string> = new Map()): string {
  if (data === null) {
    return 'null';
  }

  if (data === undefined) {
    return 'undefined';
  }

  if (Array.isArray(data)) {
    if (data.length === 0) {
      return 'any[]';
    }

    const firstItem = data[0];
    const firstItemType = generateType(firstItem, existingTypes);

    let allSameType = true;
    for (let i = 1; i < Math.min(data.length, 10); i++) {
      const itemType = generateType(data[i], existingTypes);
      if (itemType !== firstItemType) {
        allSameType = false;
        break;
      }
    }

    if (allSameType) {
      return `${firstItemType}[]`;
    } else {
      const types = new Set<string>();
      for (let i = 0; i < Math.min(data.length, 10); i++) {
        types.add(generateType(data[i], existingTypes));
      }
      return `(${Array.from(types).join(' | ')})[]`;
    }
  }

  if (typeof data === 'object' && data !== null) {
    const matchingType = findMatchingObjectType(data as Record<string, unknown>, existingTypes);
    if (matchingType) {
      return matchingType;
    }
    return generateObjectType(data as Record<string, unknown>, existingTypes);
  }

  return typeof data;
} 