export function extractPropertyNames(typeStr: string): string[] {
  const propertyNames: string[] = [];
  
  console.log('Extracting property names from:', typeStr);
  
  try {
    if (typeStr.includes('{') && typeStr.includes('}')) {
      const startBrace = typeStr.indexOf('{');
      const endBrace = typeStr.lastIndexOf('}');
      
      if (startBrace >= 0 && endBrace > startBrace) {
        const content = typeStr.substring(startBrace + 1, endBrace).trim();
        console.log('Content between braces:', content);
        
        const propertyStrings = content.split(';').filter(p => p.trim() !== '');
        console.log('Property strings:', propertyStrings);
        
        for (const propStr of propertyStrings) {
          const colonIndex = propStr.indexOf(':');
          if (colonIndex > 0) {
            const propName = propStr.substring(0, colonIndex).trim().replace(/'/g, '').replace(/"/g, '');
            propertyNames.push(propName);
          }
        }
      }
    }
    
    if (propertyNames.length === 0) {
      const propRegex = /\s*(\w+|\'\w+\')\s*:/g;
      let match;
      
      while ((match = propRegex.exec(typeStr)) !== null) {
        const propName = match[1].replace(/'/g, '').replace(/"/g, '');
        propertyNames.push(propName);
      }
    }
    
    console.log('Extracted property names:', propertyNames);
  } catch (error) {
    console.error('Error extracting property names:', error);
  }
  
  return propertyNames;
} 