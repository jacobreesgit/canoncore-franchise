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
import { Content, CreateContentData, UpdateContentProgressData } from '@/lib/types';

export class ContentService {
  private collection = collection(db, 'content');

  /**
   * Create new franchise content (episode, character, etc.)
   */
  async create(userId: string, universeId: string, data: CreateContentData): Promise<Content> {
    const now = Timestamp.now();
    const contentData = {
      ...data,
      userId,
      universeId,
      progress: data.isViewable ? 0 : undefined,
      calculatedProgress: data.isViewable ? undefined : 0,
      isPublic: true, // Will be inherited from universe in practice
      createdAt: now,
      updatedAt: now
    };

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
   * Get organisational content (series, phases) for a universe
   */
  async getOrganisationalContent(universeId: string): Promise<Content[]> {
    const q = query(
      this.collection,
      where('universeId', '==', universeId),
      where('isViewable', '==', false),
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
   * Update progress for viewable content (episodes, movies)
   */
  async updateProgress(id: string, userId: string, progressData: UpdateContentProgressData): Promise<void> {
    const content = await this.getById(id);
    
    if (!content || content.userId !== userId) {
      throw new Error('Content not found or access denied');
    }

    if (!content.isViewable) {
      throw new Error('Cannot update progress on non-viewable content');
    }

    const docRef = doc(this.collection, id);
    const updateData: any = {
      progress: progressData.progress,
      updatedAt: Timestamp.now()
    };

    if (progressData.lastAccessedAt) {
      updateData.lastAccessedAt = progressData.lastAccessedAt;
    } else {
      updateData.lastAccessedAt = Timestamp.now();
    }

    await updateDoc(docRef, updateData);
  }

  /**
   * Update calculated progress for organisational holders
   */
  async updateCalculatedProgress(id: string, calculatedProgress: number): Promise<void> {
    const content = await this.getById(id);
    
    if (!content) {
      throw new Error('Content not found');
    }

    if (content.isViewable) {
      throw new Error('Cannot update calculated progress on viewable content');
    }

    const docRef = doc(this.collection, id);
    await updateDoc(docRef, {
      calculatedProgress,
      updatedAt: Timestamp.now()
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

    const docRef = doc(this.collection, id);
    await deleteDoc(docRef);
    
    // Note: Related relationships should be cleaned up in a transaction
    // or Cloud Function for data consistency
  }

  /**
   * Get content with progress tracking info for a user
   */
  async getWithProgress(universeId: string, userId: string): Promise<Content[]> {
    const q = query(
      this.collection,
      where('universeId', '==', universeId),
      where('userId', '==', userId),
      orderBy('updatedAt', 'desc')
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Content));
  }

  /**
   * Search content within a universe by name
   */
  async search(universeId: string, searchTerm: string): Promise<Content[]> {
    const allContent = await this.getByUniverse(universeId);
    
    return allContent.filter(content =>
      content.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      content.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  /**
   * Get recently accessed viewable content for "up next" recommendations
   */
  async getRecentlyAccessed(universeId: string, limit: number = 10): Promise<Content[]> {
    const q = query(
      this.collection,
      where('universeId', '==', universeId),
      where('isViewable', '==', true),
      where('lastAccessedAt', '!=', null),
      orderBy('lastAccessedAt', 'desc')
    );
    
    const snapshot = await getDocs(q);
    const results = snapshot.docs.slice(0, limit).map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Content));
    
    return results;
  }
}