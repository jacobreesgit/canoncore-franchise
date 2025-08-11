'use client';

import { useAuth } from '@/lib/contexts/auth-context';
import { userService } from '@/lib/services';
import { useState, useEffect } from 'react';

interface FavouriteButtonProps {
  targetId: string;
  targetType: 'universe' | 'content';
  className?: string;
  showText?: boolean;
}

export function FavouriteButton({ 
  targetId, 
  targetType, 
  className = '', 
  showText = false 
}: FavouriteButtonProps) {
  const { user } = useAuth();
  const [isFavourited, setIsFavourited] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);

  // Load initial favourite status
  useEffect(() => {
    const loadFavouriteStatus = async () => {
      if (!user) {
        setIsFavourited(false);
        setHasLoaded(true);
        return;
      }

      try {
        const isFav = await userService.isFavourited(user.id, targetId, targetType);
        setIsFavourited(isFav);
      } catch (error) {
        console.error('Error checking favourite status:', error);
      } finally {
        setHasLoaded(true);
      }
    };

    loadFavouriteStatus();
  }, [user, targetId, targetType]);

  const handleToggleFavourite = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation if button is inside a link
    e.stopPropagation();

    if (!user || isLoading) return;

    setIsLoading(true);
    const newFavouriteState = !isFavourited;

    // Optimistic update
    setIsFavourited(newFavouriteState);

    try {
      if (newFavouriteState) {
        await userService.addToFavourites(user.id, targetId, targetType);
      } else {
        await userService.removeFromFavourites(user.id, targetId, targetType);
      }
    } catch (error) {
      console.error('Error updating favourite:', error);
      // Revert optimistic update on error
      setIsFavourited(!newFavouriteState);
    } finally {
      setIsLoading(false);
    }
  };

  // Don't show button if user not logged in
  if (!user) return null;

  // Show loading state while checking initial status
  if (!hasLoaded) {
    return (
      <button 
        disabled 
        className={`inline-flex items-center space-x-1 opacity-50 ${className}`}
        aria-label="Loading favourite status"
      >
        <svg className="w-5 h-5 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
        {showText && <span>Loading...</span>}
      </button>
    );
  }

  return (
    <button
      onClick={handleToggleFavourite}
      disabled={isLoading}
      className={`inline-flex items-center space-x-1 transition-colors duration-200 ${
        isLoading ? 'opacity-50' : ''
      } ${className}`}
      aria-label={isFavourited ? 'Remove from favourites' : 'Add to favourites'}
    >
      <svg 
        className={`w-5 h-5 transition-colors ${
          isFavourited 
            ? 'fill-red-500 text-red-500' 
            : 'fill-none text-gray-400 hover:text-red-500'
        }`}
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
        />
      </svg>
      {showText && (
        <span className="text-sm">
          {isFavourited ? 'Favourited' : 'Add to favourites'}
        </span>
      )}
    </button>
  );
}