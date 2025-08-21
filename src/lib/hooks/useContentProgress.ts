import { useState, useCallback, useEffect } from 'react';
import { contentService, relationshipService } from '@/lib/services';
import { Content } from '@/lib/types';

interface ProgressUpdateEvent {
  contentId: string;
  userId: string; 
  progress: number;
  parentIds?: string[]; // For hierarchy updates
  universeId: string;
}

export const useContentProgress = (initialContent: Content | null, userId: string) => {
  const [content, setContent] = useState<Content | null>(initialContent);
  const [isUpdating, setIsUpdating] = useState(false);

  // Update content when initialContent changes
  useEffect(() => {
    setContent(initialContent);
  }, [initialContent]);

  // Listen for progress updates from other components
  useEffect(() => {
    const handleProgressUpdate = async (event: Event) => {
      const customEvent = event as CustomEvent<ProgressUpdateEvent>;
      const { contentId, progress, parentIds } = customEvent.detail;
      
      setContent(prev => {
        if (!prev) return null;
        
        // Update if this is the content that changed
        if (prev.id === contentId) {
          return { ...prev, progress };
        }
        
        // Update if this content is a parent of the changed content
        if (parentIds?.includes(prev.id) && !prev.isViewable) {
          // For organisational content, recalculate progress based on children
          calculateAndUpdateParentProgress(prev.id, prev.universeId, userId);
        }
        
        return prev;
      });
    };

    window.addEventListener('progressUpdated', handleProgressUpdate);
    return () => window.removeEventListener('progressUpdated', handleProgressUpdate);
  }, [userId]);

  // Helper function to calculate and update parent progress
  const calculateAndUpdateParentProgress = async (parentId: string, universeId: string, userId: string) => {
    try {
      const children = await contentService.getChildContent(parentId, userId);
      if (children.length === 0) return;

      const viewableChildren = children.filter(child => child.isViewable);
      if (viewableChildren.length === 0) return;

      const totalProgress = viewableChildren.reduce((sum, child) => sum + (child.progress || 0), 0);
      const calculatedProgress = Math.round(totalProgress / viewableChildren.length);

      setContent(prev => 
        prev && prev.id === parentId 
          ? { ...prev, calculatedProgress } 
          : prev
      );
    } catch (error) {
      console.error('Error calculating parent progress:', error);
    }
  };

  const updateProgress = useCallback(async (newProgress: number) => {
    if (!content?.isViewable || isUpdating) return;
    
    const originalProgress = content.progress || 0;
    setIsUpdating(true);
    
    try {
      // 1. Optimistic Update (instant UI feedback)
      setContent(prev => prev ? { ...prev, progress: newProgress } : null);
      
      // 2. Server Update
      await contentService.updateUserProgress(content.id, userId, newProgress);
      
      // 3. Get parent hierarchy for cascade updates
      const parentIds = await getParentIds(content.id);
      
      // 4. Broadcast to Other Components
      window.dispatchEvent(new CustomEvent('progressUpdated', { 
        detail: { 
          contentId: content.id, 
          userId, 
          progress: newProgress,
          parentIds,
          universeId: content.universeId
        } 
      }));
      
    } catch (error) {
      // 4. Revert Optimistic Update on Error
      setContent(prev => prev ? { ...prev, progress: originalProgress } : null);
      console.error('Failed to update progress:', error);
      throw error;
    } finally {
      setIsUpdating(false);
    }
  }, [content, userId, isUpdating]);

  return { 
    content, 
    updateProgress, 
    isUpdating,
    setContent // For external updates
  };
};

// Helper function to get all parent IDs in the hierarchy
const getParentIds = async (contentId: string): Promise<string[]> => {
  try {
    const relationships = await relationshipService.getContentRelationships(contentId);
    return relationships.parentIds || [];
  } catch (error) {
    console.error('Error getting parent IDs:', error);
    return [];
  }
};