import { useState, useEffect } from 'react';

export const useScreenSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  useEffect(() => {
    // Handler to call on window resize
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Call handler right away so state gets updated with initial window size
    handleResize();

    // Remove event listener on cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
};

// Tailwind CSS breakpoints
const TAILWIND_BREAKPOINTS = {
  sm: 640,   // Small devices (landscape phones, 640px and up)
  md: 768,   // Medium devices (tablets, 768px and up)
  lg: 1024,  // Large devices (desktops, 1024px and up)
  xl: 1280,  // Extra large devices (large desktops, 1280px and up)
  '2xl': 1536 // 2X large devices (larger desktops, 1536px and up)
};

export const useIsMobile = (breakpoint: keyof typeof TAILWIND_BREAKPOINTS = 'md') => {
  const { width } = useScreenSize();
  return width < TAILWIND_BREAKPOINTS[breakpoint];
};