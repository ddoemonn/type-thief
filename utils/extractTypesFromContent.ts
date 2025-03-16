export function extractTypesFromContent(content: string): Map<string, string> {
  const typeMap = new Map<string, string>();
  
  try {
    const typeRegex = /export\s+type\s+(\w+)\s*=\s*([^;]+);/g;
    let match;
    
    while ((match = typeRegex.exec(content)) !== null) {
      const [, typeName, typeDefinition] = match;
      typeMap.set(typeName, typeDefinition.trim());
    }
  } catch (err) {
    console.error('Error extracting types from content:', err);
  }
  
  return typeMap;
} 