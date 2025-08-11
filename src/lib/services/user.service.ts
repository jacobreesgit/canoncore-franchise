import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  Timestamp 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { User, Favorite } from '@/lib/types';

export class UserService {
  private userCollection = collection(db, 'users');
  private favouriteCollection = collection(db, 'favourites');

  /**
   * Get user profile by ID
   */
  async getProfile(userId: string): Promise<User | null> {
    const docRef = doc(this.userCollection, userId);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      return null;
    }
    
    return {
      id: docSnap.id,
      ...docSnap.data()
    } as User;
  }

  /**
   * Add a universe or content item to user's favourites
   */
  async addToFavourites(userId: string, targetId: string, targetType: 'universe' | 'content'): Promise<void> {
    // Check if already favourited
    const existing = await this.getFavourite(userId, targetId, targetType);
    if (existing) {
      return; // Already favourited
    }

    const favouriteData = {
      userId,
      targetId,
      targetType,
      createdAt: Timestamp.now()
    };

    await addDoc(this.favouriteCollection, favouriteData);
  }

  /**
   * Remove from user's favourites
   */
  async removeFromFavourites(userId: string, targetId: string, targetType: 'universe' | 'content'): Promise<void> {
    const favourite = await this.getFavourite(userId, targetId, targetType);
    if (!favourite) {
      return; // Not favourited
    }

    const docRef = doc(this.favouriteCollection, favourite.id);
    await deleteDoc(docRef);
  }

  /**
   * Get a specific favourite entry
   */
  private async getFavourite(userId: string, targetId: string, targetType: 'universe' | 'content'): Promise<Favorite | null> {
    const q = query(
      this.favouriteCollection,
      where('userId', '==', userId),
      where('targetId', '==', targetId),
      where('targetType', '==', targetType)
    );
    
    const snapshot = await getDocs(q);
    if (snapshot.empty) {
      return null;
    }
    
    const doc = snapshot.docs[0];
    return {
      id: doc.id,
      ...doc.data()
    } as Favorite;
  }

  /**
   * Get all favourites for a user by type
   */
  async getFavourites(userId: string, targetType?: 'universe' | 'content'): Promise<Favorite[]> {
    let q = query(
      this.favouriteCollection,
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );

    if (targetType) {
      q = query(
        this.favouriteCollection,
        where('userId', '==', userId),
        where('targetType', '==', targetType),
        orderBy('createdAt', 'desc')
      );
    }
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Favorite));
  }

  /**
   * Get user's favourite universes with universe details
   */
  async getFavouriteUniverses(userId: string): Promise<Favorite[]> {
    return this.getFavourites(userId, 'universe');
  }

  /**
   * Get user's favourite content items with content details
   */
  async getFavouriteContent(userId: string): Promise<Favorite[]> {
    return this.getFavourites(userId, 'content');
  }

  /**
   * Check if a user has favourited a specific item
   */
  async isFavourited(userId: string, targetId: string, targetType: 'universe' | 'content'): Promise<boolean> {
    const favourite = await this.getFavourite(userId, targetId, targetType);
    return favourite !== null;
  }

  /**
   * Get user's favourite universe IDs for quick checking
   */
  async getFavouriteUniverseIds(userId: string): Promise<string[]> {
    const favourites = await this.getFavouriteUniverses(userId);
    return favourites.map(fav => fav.targetId);
  }

  /**
   * Get user's favourite content IDs for quick checking
   */
  async getFavouriteContentIds(userId: string): Promise<string[]> {
    const favourites = await this.getFavouriteContent(userId);
    return favourites.map(fav => fav.targetId);
  }

  /**
   * Get user's activity summary (total favourites, etc.)
   */
  async getActivitySummary(userId: string): Promise<{
    totalFavourites: number;
    favouriteUniverses: number;
    favouriteContent: number;
  }> {
    const allFavourites = await this.getFavourites(userId);
    const universeFavourites = allFavourites.filter(fav => fav.targetType === 'universe');
    const contentFavourites = allFavourites.filter(fav => fav.targetType === 'content');

    return {
      totalFavourites: allFavourites.length,
      favouriteUniverses: universeFavourites.length,
      favouriteContent: contentFavourites.length
    };
  }

  /**
   * Clear all favourites for a user (useful for account cleanup)
   */
  async clearAllFavourites(userId: string): Promise<void> {
    const q = query(
      this.favouriteCollection,
      where('userId', '==', userId)
    );
    
    const snapshot = await getDocs(q);
    const deletePromises = snapshot.docs.map(doc => deleteDoc(doc.ref));
    
    await Promise.all(deletePromises);
  }

  /**
   * Get recent favourite activity for a user
   */
  async getRecentFavourites(userId: string, limit: number = 10): Promise<Favorite[]> {
    const q = query(
      this.favouriteCollection,
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    
    const snapshot = await getDocs(q);
    const results = snapshot.docs.slice(0, limit).map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Favorite));
    
    return results;
  }

  /**
   * Bulk favourite/unfavourite operations
   */
  async bulkUpdateFavourites(
    userId: string, 
    operations: Array<{
      action: 'add' | 'remove';
      targetId: string;
      targetType: 'universe' | 'content';
    }>
  ): Promise<void> {
    const promises = operations.map(op => {
      if (op.action === 'add') {
        return this.addToFavourites(userId, op.targetId, op.targetType);
      } else {
        return this.removeFromFavourites(userId, op.targetId, op.targetType);
      }
    });

    await Promise.all(promises);
  }
}