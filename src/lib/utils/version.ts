/**
 * Version utilities for CanonCore
 */

// Import version directly from package.json
import packageJson from '../../../package.json';

// Get version from package.json
export const APP_VERSION = packageJson.version;

/**
 * Get formatted version string
 */
export function getVersionString(): string {
  return `v${APP_VERSION}`;
}

/**
 * Get version with build info (for development)
 */
export function getDetailedVersionString(): string {
  const isDev = process.env.NODE_ENV === 'development';
  return isDev ? `v${APP_VERSION}-dev` : `v${APP_VERSION}`;
}