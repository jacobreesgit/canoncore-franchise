'use client';

import React, { useEffect, useState } from 'react';
import { APP_VERSION } from '@/lib/utils/version';

/**
 * Footer component with version display
 */
export interface FooterProps {
  /** Optional custom class names */
  className?: string;
}

export function Footer({ className = '' }: FooterProps) {
  // Get version from version utility
  const version = APP_VERSION;
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show footer after component mounts (after hydration)
    setIsVisible(true);
  }, []);
  
  return (
    <footer className={`border-t border-gray-200 bg-white flex-shrink-0 transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'} ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col sm:flex-row justify-between items-center text-sm text-gray-500">
          <div className="mb-2 sm:mb-0">
            <span>&copy; {new Date().getFullYear()} CanonCore. Built for cataloguing real franchises.</span>
          </div>
          <div className="flex items-center gap-4">
            <span>Version {version}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;