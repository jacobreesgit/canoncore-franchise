import { db } from '@/lib/firebase';
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  Timestamp,
  writeBatch 
} from 'firebase/firestore';
import { UserProgress, CreateUserProgressData, UpdateUserProgressData } from '@/lib/types';

class UserProgressService {
  private collection = collection(db, 'userProgress');

  // Get user's progress for specific content
  async getUserProgress(userId: string, contentId: string): Promise<UserProgress | null> {
    try {
      const q = query(
        this.collection, 
        where('userId', '==', userId),
        where('contentId', '==', contentId)
      );
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        return null;
      }
      
      const doc = querySnapshot.docs[0];
      return { id: doc.id, ...doc.data() } as UserProgress;
    } catch (error) {
      console.error('Error getting user progress:', error);
      throw error;
    }
  }

  // Get all progress for a user in a specific universe
  async getUserProgressByUniverse(userId: string, universeId: string): Promise<UserProgress[]> {
    try {
      const q = query(
        this.collection,
        where('userId', '==', userId),
        where('universeId', '==', universeId),
        orderBy('updatedAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as UserProgress[];
    } catch (error) {
      console.error('Error getting user progress by universe:', error);
      throw error;
    }
  }


  // Create or update user progress for content
  async setUserProgress(userId: string, data: CreateUserProgressData): Promise<UserProgress> {
    try {
      // Check if progress already exists
      const existingProgress = await this.getUserProgress(userId, data.contentId);
      
      if (existingProgress) {
        // Update existing progress
        const updatedData = {
          progress: data.progress,
          lastAccessedAt: Timestamp.now(),
          updatedAt: Timestamp.now()
        };
        
        await updateDoc(doc(this.collection, existingProgress.id), updatedData);
        
        return {
          ...existingProgress,
          ...updatedData
        };
      } else {
        // Create new progress record
        const progressData = {
          userId,
          contentId: data.contentId,
          universeId: data.universeId,
          progress: data.progress,
          lastAccessedAt: Timestamp.now(),
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now()
        };
        
        const docRef = await addDoc(this.collection, progressData);
        
        return {
          id: docRef.id,
          ...progressData
        } as UserProgress;
      }
    } catch (error) {
      console.error('Error setting user progress:', error);
      throw error;
    }
  }

  // Delete all user progress for specific content (when content is deleted)
  async deleteUserProgressByContent(contentId: string): Promise<void> {
    try {
      const q = query(
        this.collection,
        where('contentId', '==', contentId)
      );
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        return;
      }
      
      const batch = writeBatch(db);
      
      querySnapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
      });
      
      await batch.commit();
    } catch (error) {
      console.error('Error deleting user progress by content:', error);
      throw error;
    }
  }

  // Calculate progress statistics for a universe (for a specific user)
  async calculateUniverseProgress(userId: string, universeId: string, viewableContentIds: string[]): Promise<{
    totalViewable: number;
    completed: number;
    progressPercentage: number;
  }> {
    try {
      if (viewableContentIds.length === 0) {
        return { totalViewable: 0, completed: 0, progressPercentage: 0 };
      }
      
      const userProgressList = await this.getUserProgressByUniverse(userId, universeId);
      const progressMap = new Map(userProgressList.map(p => [p.contentId, p.progress]));
      
      let completed = 0;
      
      viewableContentIds.forEach(contentId => {
        const progress = progressMap.get(contentId) || 0;
        if (progress === 100) {
          completed++;
        }
      });
      
      const progressPercentage = viewableContentIds.length > 0 
        ? Math.round((completed / viewableContentIds.length) * 100) 
        : 0;
      
      return {
        totalViewable: viewableContentIds.length,
        completed,
        progressPercentage
      };
    } catch (error) {
      console.error('Error calculating universe progress:', error);
      throw error;
    }
  }

  // Calculate progress for organisational content based on child viewable content
  async calculateOrganisationalProgress(
    userId: string, 
    organisationalContentId: string, 
    childViewableContentIds: string[]
  ): Promise<number | null> {
    try {
      if (childViewableContentIds.length === 0) {
        return null; // No viewable children, so no progress to calculate
      }

      // Get user's progress for all child viewable content
      const progressPromises = childViewableContentIds.map(contentId => 
        this.getUserProgress(userId, contentId)
      );
      const progressResults = await Promise.all(progressPromises);
      
      let completed = 0;
      progressResults.forEach(progress => {
        if (progress && progress.progress === 100) {
          completed++;
        }
      });

      return Math.round((completed / childViewableContentIds.length) * 100);
    } catch (error) {
      console.error('Error calculating organisational progress:', error);
      throw error;
    }
  }
}

export const userProgressService = new UserProgressService();