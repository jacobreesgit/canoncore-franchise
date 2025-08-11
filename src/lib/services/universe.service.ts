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
   * Update universe progress based on contained content
   */
  async updateProgress(id: string, progress: number, contentProgress?: Universe['contentProgress']): Promise<void> {
    const docRef = doc(this.collection, id);
    const updateData: any = {
      progress,
      updatedAt: Timestamp.now()
    };

    if (contentProgress) {
      updateData.contentProgress = contentProgress;
    }

    await updateDoc(docRef, updateData);
  }

  /**
   * Search public universes by name
   */
  async searchPublic(searchTerm: string): Promise<Universe[]> {
    // Note: This is a simple implementation. For better search,
    // consider using Algolia or similar search service
    const publicUniverses = await this.getPublicUniverses();
    
    return publicUniverses.filter(universe =>
      universe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      universe.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }
}