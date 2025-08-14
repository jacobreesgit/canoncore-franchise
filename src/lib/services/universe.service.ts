import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  Timestamp 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Universe, CreateUniverseData } from '@/lib/types';
import { userProgressService } from './user-progress.service';

export class UniverseService {
  private collection = collection(db, 'universes');

  /**
   * Create a new franchise universe
   */
  async create(userId: string, data: CreateUniverseData): Promise<Universe> {
    const now = Timestamp.now();
    const universeData = {
      ...data,
      userId,
      progress: 0,
      contentProgress: {
        total: 0,
        completed: 0,
        inProgress: 0,
        unstarted: 0
      },
      createdAt: now,
      updatedAt: now
    };

    const docRef = await addDoc(this.collection, universeData);
    
    return {
      id: docRef.id,
      ...universeData
    };
  }

  /**
   * Get universes owned by a specific user
   */
  async getUserUniverses(userId: string): Promise<Universe[]> {
    const q = query(
      this.collection,
      where('userId', '==', userId),
      orderBy('updatedAt', 'desc')
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Universe));
  }

  /**
   * Get all public franchise universes for discovery
   */
  async getPublicUniverses(): Promise<Universe[]> {
    const q = query(
      this.collection,
      where('isPublic', '==', true),
      orderBy('updatedAt', 'desc')
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Universe));
  }

  /**
   * Get all public universes with user-specific progress
   */
  async getPublicUniversesWithUserProgress(userId: string): Promise<Universe[]> {
    const universes = await this.getPublicUniverses();
    
    // Calculate user-specific progress for each public universe
    const universesWithProgress = await Promise.all(
      universes.map(async (universe) => {
        try {
          // Import ContentService here to avoid circular dependency
          const { contentService } = await import('./index');
          const viewableContent = await contentService.getViewableContent(universe.id);
          const viewableContentIds = viewableContent.map(c => c.id);
          
          const progressStats = await userProgressService.calculateUniverseProgress(
            userId, 
            universe.id, 
            viewableContentIds
          );
          
          return {
            ...universe,
            progress: progressStats.progressPercentage
          };
        } catch (error) {
          console.error(`Error calculating progress for universe ${universe.id}:`, error);
          return {
            ...universe,
            progress: 0
          };
        }
      })
    );
    
    return universesWithProgress;
  }

  /**
   * Get a single universe by ID
   */
  async getById(id: string): Promise<Universe | null> {
    const docRef = doc(this.collection, id);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      return null;
    }
    
    return {
      id: docSnap.id,
      ...docSnap.data()
    } as Universe;
  }

  /**
   * Update an existing universe
   */
  async update(id: string, userId: string, updates: Partial<Universe>): Promise<void> {
    // Verify ownership before updating
    const universe = await this.getById(id);
    if (!universe || universe.userId !== userId) {
      throw new Error('Universe not found or access denied');
    }

    const docRef = doc(this.collection, id);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: Timestamp.now()
    });
  }

  /**
   * Delete a universe and all its content
   */
  async delete(id: string, userId: string): Promise<void> {
    // Verify ownership before deleting
    const universe = await this.getById(id);
    if (!universe || universe.userId !== userId) {
      throw new Error('Universe not found or access denied');
    }

    const docRef = doc(this.collection, id);
    await deleteDoc(docRef);
    
    // Note: Content and relationships should be deleted in a transaction
    // or Cloud Function for data consistency
  }



  /**
   * Get universes owned by a user with user-specific progress (NEW METHOD)
   */
  async getUserUniversesWithProgress(userId: string): Promise<Universe[]> {
    const universes = await this.getUserUniverses(userId);
    
    // Calculate user-specific progress for each universe
    const universesWithProgress = await Promise.all(
      universes.map(async (universe) => {
        try {
          // Import ContentService here to avoid circular dependency
          const { contentService } = await import('./index');
          const viewableContent = await contentService.getViewableContent(universe.id);
          const viewableContentIds = viewableContent.map(c => c.id);
          
          const progressStats = await userProgressService.calculateUniverseProgress(
            userId, 
            universe.id, 
            viewableContentIds
          );
          
          return {
            ...universe,
            progress: progressStats.progressPercentage,
            contentProgress: {
              total: progressStats.totalViewable,
              completed: progressStats.completed,
              inProgress: 0, // Not tracking in-progress with binary system
              unstarted: progressStats.totalViewable - progressStats.completed
            }
          };
        } catch (error) {
          console.error(`Error calculating progress for universe ${universe.id}:`, error);
          return universe; // Return original universe if progress calculation fails
        }
      })
    );
    
    return universesWithProgress;
  }

  /**
   * Get single universe with user-specific progress (NEW METHOD)
   */
  async getByIdWithUserProgress(universeId: string, currentUserId: string): Promise<Universe | null> {
    const universe = await this.getById(universeId);
    if (!universe) {
      return null;
    }
    
    try {
      // Import ContentService here to avoid circular dependency
      const { contentService } = await import('./index');
      const viewableContent = await contentService.getViewableContent(universeId);
      const viewableContentIds = viewableContent.map(c => c.id);
      
      const progressStats = await userProgressService.calculateUniverseProgress(
        currentUserId, 
        universeId, 
        viewableContentIds
      );
      
      return {
        ...universe,
        progress: progressStats.progressPercentage,
        contentProgress: {
          total: progressStats.totalViewable,
          completed: progressStats.completed,
          inProgress: 0, // Not tracking in-progress with binary system
          unstarted: progressStats.totalViewable - progressStats.completed
        }
      };
    } catch (error) {
      console.error(`Error calculating progress for universe ${universeId}:`, error);
      return universe; // Return original universe if progress calculation fails
    }
  }
}