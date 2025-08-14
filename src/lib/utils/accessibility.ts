// @ts-ignore - polychrome doesn't have TypeScript definitions
const { contrast } = require('polychrome');

/**
 * Accessibility utilities for WCAG compliance checking
 */

/**
 * WCAG contrast ratio thresholds
 */
export const CONTRAST_THRESHOLDS = {
  AA_NORMAL: 4.5,     // WCAG AA for normal text
  AA_LARGE: 3.0,      // WCAG AA for large text (18pt+)
  AAA_NORMAL: 7.0,    // WCAG AAA for normal text
  AAA_LARGE: 4.5,     // WCAG AAA for large text
} as const;

/**
 * Calculate contrast ratio between two colors
 * @param background - Background color (hex, rgb, hsl)
 * @param foreground - Foreground color (hex, rgb, hsl)
 * @returns Contrast ratio (1-21)
 */
export function getContrastRatio(background: string, foreground: string): number {
  try {
    return contrast(background, foreground);
  } catch (error) {
    console.error('Error calculating contrast ratio:', error);
    return 1; // Fail safe - lowest possible contrast
  }
}

/**
 * Check if color combination meets WCAG guidelines
 * @param background - Background color
 * @param foreground - Foreground color  
 * @param level - WCAG compliance level ('AA' | 'AAA')
 * @param isLargeText - Whether text is large (18pt+ or 14pt+ bold)
 * @returns Whether combination passes WCAG guidelines
 */
export function meetsWCAGContrast(
  background: string,
  foreground: string,
  level: 'AA' | 'AAA' = 'AA',
  isLargeText: boolean = false
): boolean {
  const ratio = getContrastRatio(background, foreground);
  
  if (level === 'AAA') {
    return ratio >= (isLargeText ? CONTRAST_THRESHOLDS.AAA_LARGE : CONTRAST_THRESHOLDS.AAA_NORMAL);
  }
  
  return ratio >= (isLargeText ? CONTRAST_THRESHOLDS.AA_LARGE : CONTRAST_THRESHOLDS.AA_NORMAL);
}

/**
 * Get accessible text color for a given background
 * @param backgroundColor - Background color
 * @param level - WCAG compliance level
 * @returns Either white or black text color for best contrast
 */
export function getAccessibleTextColor(
  backgroundColor: string,
  level: 'AA' | 'AAA' = 'AA'
): '#ffffff' | '#000000' {
  const whiteContrast = getContrastRatio(backgroundColor, '#ffffff');
  const blackContrast = getContrastRatio(backgroundColor, '#000000');
  
  const threshold = level === 'AAA' ? CONTRAST_THRESHOLDS.AAA_NORMAL : CONTRAST_THRESHOLDS.AA_NORMAL;
  
  // If both meet threshold, choose the higher contrast
  if (whiteContrast >= threshold && blackContrast >= threshold) {
    return whiteContrast > blackContrast ? '#ffffff' : '#000000';
  }
  
  // Return the one that meets threshold, or higher contrast if neither do
  if (whiteContrast >= threshold) return '#ffffff';
  if (blackContrast >= threshold) return '#000000';
  
  return whiteContrast > blackContrast ? '#ffffff' : '#000000';
}

/**
 * Design system color validation utilities
 */
export const validateDesignSystem = {
  /**
   * Check ViewToggle component contrast
   */
  viewToggle: () => {
    const results = [];
    
    // Check inactive button contrast (gray on gray)
    const bgSecondary = '#f3f4f6'; // --color-gray-100
    const textSecondary = '#4b5563'; // --color-gray-600
    
    const ratio = getContrastRatio(bgSecondary, textSecondary);
    const passes = meetsWCAGContrast(bgSecondary, textSecondary, 'AA');
    
    results.push({
      component: 'ViewToggle',
      state: 'inactive',
      background: bgSecondary,
      foreground: textSecondary,
      ratio: ratio.toFixed(2),
      passes,
      wcagLevel: passes ? 'AA' : 'FAIL'
    });
    
    return results;
  },
  
  /**
   * Check Navigation component contrast
   */
  navigation: () => {
    const results = [];
    
    // Check active link contrast
    const bgWhite = '#ffffff';
    const linkBlue = '#2563eb'; // --color-blue-600
    
    const ratio = getContrastRatio(bgWhite, linkBlue);
    const passes = meetsWCAGContrast(bgWhite, linkBlue, 'AA');
    
    results.push({
      component: 'Navigation',
      state: 'active link',
      background: bgWhite,
      foreground: linkBlue,
      ratio: ratio.toFixed(2),
      passes,
      wcagLevel: passes ? 'AA' : 'FAIL'
    });
    
    return results;
  },
  
  /**
   * Run all design system contrast checks
   */
  all: () => {
    return [
      ...validateDesignSystem.viewToggle(),
      ...validateDesignSystem.navigation(),
    ];
  }
};

/**
 * Development helper to log contrast issues
 */
export function logContrastIssues(): void {
  if (process.env.NODE_ENV !== 'development') return;
  
  const issues = validateDesignSystem.all().filter(result => !result.passes);
  
  if (issues.length > 0) {
    console.group('🚨 Accessibility Contrast Issues Found');
    issues.forEach(issue => {
      console.warn(`${issue.component} (${issue.state}): ${issue.ratio}:1 ratio - WCAG ${issue.wcagLevel}`);
      console.log(`  Background: ${issue.background}`);
      console.log(`  Foreground: ${issue.foreground}`);
    });
    console.groupEnd();
  } else {
    console.log('✅ All contrast checks passed!');
  }
}