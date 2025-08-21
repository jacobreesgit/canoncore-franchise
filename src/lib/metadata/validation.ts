import type { JSONLDBase } from './json-ld';

export function validateJSONLD(jsonLd: JSONLDBase | JSONLDBase[]): boolean {
  try {
    const data = Array.isArray(jsonLd) ? jsonLd : [jsonLd];
    
    for (const item of data) {
      // Check required Schema.org properties
      if (!item['@context'] || !item['@type']) {
        console.error('Invalid JSON-LD: Missing @context or @type', item);
        return false;
      }
      
      // Ensure @context is Schema.org
      if (item['@context'] !== 'https://schema.org') {
        console.error('Invalid JSON-LD: @context should be https://schema.org', item);
        return false;
      }
      
      // Check for common required properties based on type
      const type = item['@type'];
      switch (type) {
        case 'MovieSeries':
        case 'TVSeries':
        case 'VideoGameSeries':
        case 'CreativeWorkSeries':
          if (!item.name) {
            console.error(`Invalid ${type}: Missing name property`, item);
            return false;
          }
          break;
        
        case 'Movie':
        case 'Episode':
        case 'Book':
          if (!item.name || !item.isPartOf) {
            console.error(`Invalid ${type}: Missing name or isPartOf property`, item);
            return false;
          }
          break;
        
        case 'Person':
          if (!item.name) {
            console.error('Invalid Person: Missing name property', item);
            return false;
          }
          break;
        
        case 'ProfilePage':
          if (!item.name || !item.mainEntity) {
            console.error('Invalid ProfilePage: Missing name or mainEntity property', item);
            return false;
          }
          break;
        
        case 'CollectionPage':
          if (!item.name || !item.hasPart) {
            console.error('Invalid CollectionPage: Missing name or hasPart property', item);
            return false;
          }
          break;
        
        case 'BreadcrumbList':
          if (!item.itemListElement || !Array.isArray(item.itemListElement)) {
            console.error('Invalid BreadcrumbList: Missing or invalid itemListElement', item);
            return false;
          }
          break;
      }
    }
    
    return true;
  } catch (error) {
    console.error('JSON-LD validation error:', error);
    return false;
  }
}

export function logJSONLD(jsonLd: JSONLDBase | JSONLDBase[], label: string = 'JSON-LD'): void {
  if (process.env.NODE_ENV === 'development') {
    console.log(`${label}:`, JSON.stringify(jsonLd, null, 2));
    
    const isValid = validateJSONLD(jsonLd);
    console.log(`${label} validation:`, isValid ? '✅ Valid' : '❌ Invalid');
  }
}

// Test function for validating sample data
export function testJSONLDGeneration(): void {
  if (process.env.NODE_ENV === 'development') {
    console.log('🧪 Testing JSON-LD generation...');
    
    // This would be called during development to test our generators
    console.log('✅ JSON-LD generation tests would run here');
  }
}