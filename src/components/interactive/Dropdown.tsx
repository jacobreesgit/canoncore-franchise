'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Button } from './Button';

export interface DropdownOption {
  /** Option label */
  label: string;
  /** Option value */
  value: string;
  /** Link destination for navigation options */
  href?: string;
  /** Click handler for action options */
  onClick?: () => void;
  /** Optional icon element */
  icon?: React.ReactNode;
  /** Disabled state */
  disabled?: boolean;
}

export interface DropdownProps {
  /** Dropdown trigger label */
  label: string;
  /** Dropdown options */
  options: DropdownOption[];
  /** Button variant for trigger */
  variant?: 'primary' | 'secondary' | 'danger' | 'clear';
  /** Button size */
  size?: 'small' | 'default' | 'large';
  /** Optional icon for trigger button */
  icon?: React.ReactNode;
  /** Optional custom class names */
  className?: string;
  /** Disabled state */
  disabled?: boolean;
}

/**
 * Dropdown component using buttons as select options
 */
export function Dropdown({
  label,
  options,
  variant = 'secondary',
  size = 'default',
  icon,
  className = '',
  disabled = false
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Close dropdown on escape key
  useEffect(() => {
    function handleEscapeKey(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey);
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isOpen]);

  const handleTriggerClick = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  const handleOptionClick = (option: DropdownOption) => {
    setIsOpen(false);
    if (option.onClick) {
      option.onClick();
    }
  };

  return (
    <div ref={dropdownRef} className={`relative inline-block ${className}`}>
      {/* Trigger Button */}
      <Button
        variant={variant}
        size={size}
        disabled={disabled}
        onClick={handleTriggerClick}
        icon={icon}
        className="flex items-center"
      >
        {label}
        <svg 
          className={`ml-2 h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </Button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-default z-50">
          <div className="py-2">
            {options.map((option) => (
              <React.Fragment key={option.value}>
                {option.href ? (
                  <a
                    href={option.href}
                    className={`
                      flex items-center w-full px-4 py-2 text-left text-sm transition-colors
                      ${option.disabled 
                        ? 'text-secondary cursor-not-allowed opacity-50' 
                        : 'text-primary hover:bg-surface-page active:bg-surface-card cursor-pointer'
                      }
                    `}
                    onClick={() => !option.disabled && setIsOpen(false)}
                  >
                    {option.icon && (
                      <span className="mr-3 flex-shrink-0">
                        {option.icon}
                      </span>
                    )}
                    {option.label}
                  </a>
                ) : (
                  <button
                    onClick={() => !option.disabled && handleOptionClick(option)}
                    disabled={option.disabled}
                    className={`
                      flex items-center w-full px-4 py-2 text-left text-sm transition-colors
                      ${option.disabled 
                        ? 'text-secondary cursor-not-allowed opacity-50' 
                        : 'text-primary hover:bg-surface-page active:bg-surface-card cursor-pointer'
                      }
                    `}
                  >
                    {option.icon && (
                      <span className="mr-3 flex-shrink-0">
                        {option.icon}
                      </span>
                    )}
                    {option.label}
                  </button>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Dropdown;