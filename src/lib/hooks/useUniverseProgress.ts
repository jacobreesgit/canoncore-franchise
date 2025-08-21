import { useState, useEffect } from 'react';
import { contentService } from '@/lib/services';

interface ProgressUpdateEvent {
  contentId: string;
  userId: string; 
  progress: number;
  parentIds?: string[];
  universeId: string;
}

interface UniverseProgressUpdateEvent {
  universeId: string;
  progress: number;
}

export const useUniverseProgress = (universeId: string, initialProgress: number = 0, userId: string) => {
  const [universeProgress, setUniverseProgress] = useState(initialProgress);
  const [isCalculating, setIsCalculating] = useState(false);

  // Update progress when initialProgress changes (e.g., when universe data loads)
  useEffect(() => {
    setUniverseProgress(initialProgress);
  }, [initialProgress]);

  // Listen for individual content progress updates
  useEffect(() => {
    const handleProgressUpdate = async (event: Event) => {
      const customEvent = event as CustomEvent<ProgressUpdateEvent>;
      const { universeId: eventUniverseId } = customEvent.detail;
      
      // Only recalculate if the update is for this universe
      if (eventUniverseId === universeId) {
        setIsCalculating(true);
        try {
          // Recalculate universe progress
          const newProgress = await calculateUniverseProgress(universeId, userId);
          setUniverseProgress(newProgress);
          
          // Broadcast universe progress update for other components
          window.dispatchEvent(new CustomEvent('universeProgressUpdated', {
            detail: { universeId, progress: newProgress }
          }));
        } catch (error) {
          console.error('Error recalculating universe progress:', error);
        } finally {
          setIsCalculating(false);
        }
      }
    };

    window.addEventListener('progressUpdated', handleProgressUpdate);
    return () => window.removeEventListener('progressUpdated', handleProgressUpdate);
  }, [universeId, userId]);

  // Listen for universe progress updates from other components
  useEffect(() => {
    const handleUniverseUpdate = (event: CustomEvent<UniverseProgressUpdateEvent>) => {
      const { universeId: eventUniverseId, progress } = event.detail;
      
      if (eventUniverseId === universeId) {
        setUniverseProgress(progress);
      }
    };

    window.addEventListener('universeProgressUpdated', handleUniverseUpdate as EventListener);
    return () => window.removeEventListener('universeProgressUpdated', handleUniverseUpdate as EventListener);
  }, [universeId]);

  return { 
    universeProgress, 
    isCalculating,
    setUniverseProgress // For external updates
  };
};

// Helper function to calculate universe progress based on all content
const calculateUniverseProgress = async (universeId: string, userId: string): Promise<number> => {
  try {
    const allContent = await contentService.getByUniverseWithUserProgress(universeId, userId);
    const viewableContent = allContent.filter(content => content.isViewable);
    
    if (viewableContent.length === 0) {
      return 0;
    }
    
    const totalProgress = viewableContent.reduce((sum, content) => sum + (content.progress || 0), 0);
    return Math.round(totalProgress / viewableContent.length);
  } catch (error) {
    console.error('Error calculating universe progress:', error);
    return 0;
  }
};