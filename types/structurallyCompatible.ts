export function structurallyCompatible(
  obj: Record<string, unknown>,
  typeDefinition: string
): boolean {
  const typeProperties = extractTypeProperties(typeDefinition);
  const objKeys = Object.keys(obj);
  
  if (!typeProperties || typeProperties.length === 0) {
    return false;
  }
  
  for (const { name, optional } of typeProperties) {
    const hasProperty = objKeys.includes(name);
    
    if (!hasProperty && !optional) {
      return false;
    }
  }
  
  return true;
}

function extractTypeProperties(typeDefinition: string): Array<{ name: string; optional: boolean }> | null {
  try {
    const braceStart = typeDefinition.indexOf('{');
    const braceEnd = typeDefinition.lastIndexOf('}');
    
    if (braceStart === -1 || braceEnd === -1) {
      return null;
    }
    
    const content = typeDefinition.substring(braceStart + 1, braceEnd).trim();
    const properties: Array<{ name: string; optional: boolean }> = [];
    
    const propertyRegex = /(\w+)(\?)?:\s*([^;]+);?/g;
    let match;
    
    while ((match = propertyRegex.exec(content)) !== null) {
      const [, name, optional] = match;
      properties.push({
        name,
        optional: optional === '?'
      });
    }
    
    return properties;
  } catch (err) {
    console.error('Error extracting type properties:', err);
    return null;
  }
} 