export function areObjectsStructurallyEqual(obj1: Record<string, unknown>, obj2: Record<string, unknown>): boolean {
  if (obj1 === null || obj2 === null) {
    return false;
  }
  
  const keys1 = Object.keys(obj1).sort();
  const keys2 = Object.keys(obj2).sort();
  
  if (keys1.length !== keys2.length) {
    return false;
  }
  
  return keys1.every(key => keys2.includes(key));
} 