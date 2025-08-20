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
import { Content, CreateContentData } from '@/lib/types';
import { userProgressService } from './user-progress.service';

export class ContentService {
  private collection = collection(db, 'content');

  /**
   * Create new franchise content (episode, character, etc.)
   */
  async create(userId: string, universeId: string, data: CreateContentData): Promise<Content> {
    const now = Timestamp.now();
    const contentData: any = {
      ...data,
      userId,
      universeId,
      isPublic: true, // Will be inherited from universe in practice
      createdAt: now,
      updatedAt: now
    };

    // Only add progress fields if they have defined values
    if (data.isViewable) {
      contentData.progress = 0;
    } else {
      contentData.calculatedProgress = 0;
    }

    const docRef = await addDoc(this.collection, contentData);
    
    return {
      id: docRef.id,
      ...contentData
    };
  }

  /**
   * Get all content for a specific universe
   */
  async getByUniverse(universeId: string): Promise<Content[]> {
    const q = query(
      this.collection,
      where('universeId', '==', universeId),
      orderBy('createdAt', 'asc')
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Content));
  }

  /**
   * Get content by media type within a universe
   */
  async getByMediaType(universeId: string, mediaType: Content['mediaType']): Promise<Content[]> {
    const q = query(
      this.collection,
      where('universeId', '==', universeId),
      where('mediaType', '==', mediaType),
      orderBy('createdAt', 'asc')
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Content));
  }

  /**
   * Get viewable content (episodes, movies) for a universe
   */
  async getViewableContent(universeId: string): Promise<Content[]> {
    const q = query(
      this.collection,
      where('universeId', '==', universeId),
      where('isViewable', '==', true),
      orderBy('createdAt', 'asc')
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Content));
  }

  /**
   * Get a single content item by ID
   */
  async getById(id: string): Promise<Content | null> {
    const docRef = doc(this.collection, id);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      return null;
    }
    
    return {
      id: docSnap.id,
      ...docSnap.data()
    } as Content;
  }

  /**
   * Update content details
   */
  async update(id: string, userId: string, updates: Partial<Content>): Promise<void> {
    // Verify ownership before updating
    const content = await this.getById(id);
    if (!content || content.userId !== userId) {
      throw new Error('Content not found or access denied');
    }

    const docRef = doc(this.collection, id);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: Timestamp.now()
    });
  }


  /**
   * Update user-specific progress for viewable content (NEW METHOD)
   */
  async updateUserProgress(contentId: string, userId: string, progress: number): Promise<void> {
    // Get content to verify it exists and is viewable
    const content = await this.getById(contentId);
    
    if (!content) {
      throw new Error('Content not found');
    }

    if (!content.isViewable) {
      throw new Error('Cannot update progress on non-viewable content');
    }

    // Set user-specific progress using UserProgressService
    await userProgressService.setUserProgress(userId, {
      contentId,
      universeId: content.universeId,
      progress
    });
  }

  /**
   * Delete content item
   */
  async delete(id: string, userId: string): Promise<void> {
    // Verify ownership before deleting
    const content = await this.getById(id);
    if (!content || content.userId !== userId) {
      throw new Error('Content not found or access denied');
    }

    // Delete the content document
    const docRef = doc(this.collection, id);
    await deleteDoc(docRef);
    
    // Clean up all user progress for this content
    await userProgressService.deleteUserProgressByContent(id);
    
    // Clean up all relationships where this content is involved
    const { relationshipService } = await import('./index');
    await relationshipService.removeAllRelationships(id, userId);
  }


  /**
   * Get universe content combined with user-specific progress (NEW METHOD)
   */
  async getByUniverseWithUserProgress(universeId: string, currentUserId: string): Promise<Content[]> {
    // Get all content in the universe
    const content = await this.getByUniverse(universeId);
    
    // Get user's progress for this universe
    const userProgressList = await userProgressService.getUserProgressByUniverse(currentUserId, universeId);
    const progressMap = new Map(userProgressList.map(p => [p.contentId, p]));
    
    // Get hierarchy for calculating organisational progress
    const { relationshipService } = await import('./index');
    const relationships = await relationshipService.getUniverseHierarchy(universeId);
    
    // Combine content with user-specific progress and calculated progress for organisational content
    const contentWithProgress = await Promise.all(content.map(async item => {
      const userProgress = progressMap.get(item.id);
      let calculatedProgress: number | null | undefined;
      
      // Calculate progress for organisational content based on children
      if (!item.isViewable) {
        // Get child viewable content for this organisational item
        const childRelationships = relationships.filter(rel => rel.parentId === item.id);
        const childViewableContentIds = childRelationships
          .map(rel => rel.contentId)
          .filter(childId => {
            const childContent = content.find(c => c.id === childId);
            return childContent?.isViewable;
          });
        
        if (childViewableContentIds.length > 0) {
          calculatedProgress = await userProgressService.calculateOrganisationalProgress(
            currentUserId,
            item.id,
            childViewableContentIds
          );
        }
      }
      
      return {
        ...item,
        // Override content.progress with user-specific progress for viewable content
        progress: userProgress?.progress || (item.isViewable ? 0 : undefined),
        // Set calculated progress for organisational content (null/undefined means no viewable children)
        calculatedProgress: calculatedProgress !== null ? calculatedProgress : undefined,
        lastAccessedAt: userProgress?.lastAccessedAt || item.lastAccessedAt
      };
    }));
    
    return contentWithProgress;
  }

  /**
   * Get single content item with user-specific progress (NEW METHOD)
   */
  async getByIdWithUserProgress(contentId: string, currentUserId: string): Promise<Content | null> {
    // Get the base content
    const content = await this.getById(contentId);
    if (!content) {
      return null;
    }
    
    // Get user-specific progress
    const userProgress = await userProgressService.getUserProgress(currentUserId, contentId);
    
    // Combine content with user-specific progress
    return {
      ...content,
      // Override content.progress with user-specific progress
      progress: userProgress?.progress || (content.isViewable ? 0 : undefined),
      lastAccessedAt: userProgress?.lastAccessedAt || content.lastAccessedAt
    };
  }


}