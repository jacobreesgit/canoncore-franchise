'use client';

import { useAuth } from '@/lib/contexts/auth-context';
import { userService } from '@/lib/services';
import { useState, useEffect } from 'react';
import { Button } from './Button';

interface FavouriteButtonProps {
  targetId: string;
  targetType: 'universe' | 'content';
  className?: string;
  showText?: boolean;
  size?: 'small' | 'default' | 'large';
}

export function FavouriteButton({ 
  targetId, 
  targetType, 
  className = '', 
  showText = false,
  size = 'default'
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

  // Get icon size classes based on size prop
  const getIconSizeClass = () => {
    switch (size) {
      case 'small':
        return 'w-4 h-4';
      case 'large':
        return 'w-6 h-6';
      default:
        return 'w-5 h-5';
    }
  };

  // Heart icon component
  const heartIcon = (
    <svg 
      className={`${getIconSizeClass()} transition-colors ${
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
  );

  // Show loading state while checking initial status
  if (!hasLoaded) {
    return (
      <Button
        variant="clear"
        size="small"
        disabled
        loading
        icon={heartIcon}
        className={`favourite-button ${className}`}
        aria-label="Loading favourite status"
      >
        {showText && 'Loading...'}
      </Button>
    );
  }

  return (
    <Button
      variant="clear"
      size="small"
      onClick={handleToggleFavourite}
      disabled={isLoading}
      loading={isLoading}
      icon={heartIcon}
      className={`favourite-button ${className}`}
      aria-label={isFavourited ? 'Remove from favourites' : 'Add to favourites'}
    >
      {showText && (isFavourited ? 'Favourited' : 'Add to favourites')}
    </Button>
  );
}