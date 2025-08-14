/**
 * Accessibility utility tests
 * Run with: npm test accessibility
 */

import { 
  getContrastRatio, 
  meetsWCAGContrast, 
  getAccessibleTextColor,
  validateDesignSystem,
  CONTRAST_THRESHOLDS
} from './accessibility';

/**
 * Manual test runner for accessibility checks
 * This will be logged in development console
 */
export function runAccessibilityTests(): void {
  console.group('🧪 Accessibility Tests');
  
  // Test 1: Basic contrast calculation
  console.group('Basic Contrast Tests');
  const whiteOnBlack = getContrastRatio('#000000', '#ffffff');
  console.log(`White on Black: ${whiteOnBlack.toFixed(2)}:1 (Expected: 21:1)`);
  
  const grayOnGray = getContrastRatio('#f3f4f6', '#4b5563');
  console.log(`Gray-100 on Gray-600: ${grayOnGray.toFixed(2)}:1`);
  console.groupEnd();
  
  // Test 2: WCAG compliance
  console.group('WCAG Compliance Tests');
  console.log(`White on Black meets AA: ${meetsWCAGContrast('#000000', '#ffffff', 'AA')}`);
  console.log(`Gray-100/Gray-600 meets AA: ${meetsWCAGContrast('#f3f4f6', '#4b5563', 'AA')}`);
  console.groupEnd();
  
  // Test 3: Accessible text color suggestions
  console.group('Accessible Text Color Tests');
  console.log(`Best text for blue background: ${getAccessibleTextColor('#2563eb')}`);
  console.log(`Best text for light gray: ${getAccessibleTextColor('#f3f4f6')}`);
  console.log(`Best text for dark gray: ${getAccessibleTextColor('#374151')}`);
  console.groupEnd();
  
  // Test 4: Design system validation
  console.group('Design System Validation');
  const designSystemResults = validateDesignSystem.all();
  designSystemResults.forEach(result => {
    const status = result.passes ? '✅' : '❌';
    console.log(`${status} ${result.component} (${result.state}): ${result.ratio}:1`);
  });
  console.groupEnd();
  
  console.groupEnd();
}

// Auto-run in development
if (process.env.NODE_ENV === 'development') {
  // Delay to ensure polychrome is loaded
  setTimeout(() => {
    runAccessibilityTests();
  }, 1000);
}