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
import { ContentRelationship, Content } from '@/lib/types';

export class RelationshipService {
  private collection = collection(db, 'contentRelationships');

  /**
   * Create a hierarchical relationship between content items
   */
  async createRelationship(
    userId: string,
    universeId: string,
    parentId: string,
    contentId: string,
    displayOrder?: number,
    contextDescription?: string
  ): Promise<ContentRelationship> {
    // Verify both content items exist and belong to the user
    const parentContent = await this.verifyContentOwnership(parentId, userId);
    await this.verifyContentOwnership(contentId, userId);

    // Validate hierarchy rules: only organisational content can be parents
    if (parentContent.isViewable) {
      throw new Error('Viewable content (movies, episodes, books) cannot have children. Only organisational content (collections, series, phases) can be parents.');
    }

    const relationshipData: any = {
      contentId,
      parentId,
      universeId,
      userId,
      displayOrder: displayOrder ?? 0,
      createdAt: Timestamp.now()
    };

    // Only add contextDescription if it's not undefined
    if (contextDescription !== undefined) {
      relationshipData.contextDescription = contextDescription;
    }

    const docRef = await addDoc(this.collection, relationshipData);
    
    return {
      id: docRef.id,
      ...relationshipData
    };
  }

  /**
   * Get all children of a parent content item
   */
  async getChildren(parentId: string): Promise<ContentRelationship[]> {
    const q = query(
      this.collection,
      where('parentId', '==', parentId),
      orderBy('displayOrder', 'asc'),
      orderBy('createdAt', 'asc')
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as ContentRelationship));
  }

  /**
   * Get all parents of a content item (reverse lookup)
   */
  async getParents(contentId: string): Promise<ContentRelationship[]> {
    const q = query(
      this.collection,
      where('contentId', '==', contentId),
      orderBy('createdAt', 'asc')
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as ContentRelationship));
  }

  /**
   * Get complete hierarchy tree for a universe
   */
  async getUniverseHierarchy(universeId: string): Promise<ContentRelationship[]> {
    const q = query(
      this.collection,
      where('universeId', '==', universeId),
      orderBy('displayOrder', 'asc')
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as ContentRelationship));
  }

  /**
   * Update relationship order and context
   */
  async updateRelationship(
    relationshipId: string, 
    userId: string,
    updates: {
      displayOrder?: number;
      contextDescription?: string;
    }
  ): Promise<void> {
    const relationship = await this.getById(relationshipId);
    
    if (!relationship || relationship.userId !== userId) {
      throw new Error('Relationship not found or access denied');
    }

    const docRef = doc(this.collection, relationshipId);
    await updateDoc(docRef, updates);
  }

  /**
   * Remove a hierarchical relationship
   */
  async removeRelationship(relationshipId: string, userId: string): Promise<void> {
    const relationship = await this.getById(relationshipId);
    
    if (!relationship || relationship.userId !== userId) {
      throw new Error('Relationship not found or access denied');
    }

    const docRef = doc(this.collection, relationshipId);
    await deleteDoc(docRef);
  }

  /**
   * Get a single relationship by ID
   */
  async getById(id: string): Promise<ContentRelationship | null> {
    const docRef = doc(this.collection, id);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      return null;
    }
    
    return {
      id: docSnap.id,
      ...docSnap.data()
    } as ContentRelationship;
  }

  /**
   * Build a complete hierarchy tree structure
   */
  async buildHierarchyTree(universeId: string): Promise<HierarchyNode[]> {
    const relationships = await this.getUniverseHierarchy(universeId);
    
    // Get all content to sort by creation time
    const contentDocs = await getDocs(query(
      collection(db, 'content'),
      where('universeId', '==', universeId)
    ));
    const contentMap = new Map(
      contentDocs.docs.map(doc => [doc.id, { id: doc.id, ...doc.data() } as any])
    );
    
    // Group relationships by parent
    const childrenMap = new Map<string, ContentRelationship[]>();
    const allContentIds = new Set<string>();
    
    relationships.forEach(rel => {
      if (!childrenMap.has(rel.parentId)) {
        childrenMap.set(rel.parentId, []);
      }
      childrenMap.get(rel.parentId)!.push(rel);
      allContentIds.add(rel.parentId);
      allContentIds.add(rel.contentId);
    });

    // Sort children by content creation time (newest last)
    childrenMap.forEach((children, parentId) => {
      children.sort((a, b) => {
        const contentA = contentMap.get(a.contentId);
        const contentB = contentMap.get(b.contentId);
        if (!contentA || !contentB) return 0;
        
        // First sort by displayOrder (default to 0 if undefined)
        const orderA = a.displayOrder ?? 0;
        const orderB = b.displayOrder ?? 0;
        if (orderA !== orderB) {
          return orderA - orderB;
        }
        
        // Then by content creation time (oldest first, so newest appears last)
        const timeA = contentA.createdAt?.toDate?.() || new Date(contentA.createdAt);
        const timeB = contentB.createdAt?.toDate?.() || new Date(contentB.createdAt);
        return timeA.getTime() - timeB.getTime();
      });
    });

    // Find root nodes (content that are parents but not children)
    const childIds = new Set(relationships.map(rel => rel.contentId));
    const rootIds = [...new Set(relationships.map(rel => rel.parentId))]
      .filter(id => !childIds.has(id))
      .sort((a, b) => {
        // Sort root nodes by content creation time (oldest first, newest last)
        const contentA = contentMap.get(a);
        const contentB = contentMap.get(b);
        if (!contentA || !contentB) return 0;
        
        const timeA = contentA.createdAt?.toDate?.() || new Date(contentA.createdAt);
        const timeB = contentB.createdAt?.toDate?.() || new Date(contentB.createdAt);
        return timeA.getTime() - timeB.getTime();
      });

    // Build tree recursively
    const buildNode = (contentId: string): HierarchyNode => {
      const children = childrenMap.get(contentId) || [];
      return {
        contentId,
        children: children.map(child => buildNode(child.contentId)),
        relationship: children.length > 0 ? children[0] : null
      };
    };

    return rootIds.map(rootId => buildNode(rootId));
  }

  /**
   * Reorder children under a parent
   */
  async reorderChildren(parentId: string, userId: string, childOrder: string[]): Promise<void> {
    const children = await this.getChildren(parentId);
    
    // Verify ownership
    const userChildren = children.filter(child => child.userId === userId);
    if (userChildren.length !== children.length) {
      throw new Error('Access denied to some relationships');
    }

    // Update display order for each child
    const updates = childOrder.map((contentId, index) => {
      const relationship = children.find(child => child.contentId === contentId);
      if (!relationship) {
        throw new Error(`Content ${contentId} not found in children`);
      }
      
      return this.updateRelationship(relationship.id, userId, { displayOrder: index });
    });

    await Promise.all(updates);
  }

  /**
   * Remove all relationships for a content item (when deleting content)
   */
  async removeAllRelationships(contentId: string, userId: string): Promise<void> {
    // Remove as child
    const asChild = await this.getParents(contentId);
    const removeChildPromises = asChild
      .filter(rel => rel.userId === userId)
      .map(rel => this.removeRelationship(rel.id, userId));

    // Remove as parent
    const asParent = await this.getChildren(contentId);
    const removeParentPromises = asParent
      .filter(rel => rel.userId === userId)
      .map(rel => this.removeRelationship(rel.id, userId));

    await Promise.all([...removeChildPromises, ...removeParentPromises]);
  }

  /**
   * Get child relationships for a parent content ID
   */
  async getChildRelationships(parentId: string): Promise<ContentRelationship[]> {
    return this.getChildren(parentId);
  }

  /**
   * Get content relationships to find parent IDs in hierarchy
   */
  async getContentRelationships(contentId: string): Promise<{ parentIds: string[] }> {
    const parents = await this.getParents(contentId);
    const parentIds = parents.map(rel => rel.parentId);
    return { parentIds };
  }


  /**
   * Verify content ownership before creating relationships
   */
  private async verifyContentOwnership(contentId: string, userId: string): Promise<Content> {
    const contentDoc = await getDoc(doc(db, 'content', contentId));
    
    if (!contentDoc.exists()) {
      throw new Error(`Content ${contentId} not found`);
    }

    const content = contentDoc.data() as Content;
    if (content.userId !== userId) {
      throw new Error(`Access denied to content ${contentId}`);
    }
    
    return { ...content, id: contentDoc.id };
  }
}

// Helper interface for hierarchy tree building
interface HierarchyNode {
  contentId: string;
  children: HierarchyNode[];
  relationship: ContentRelationship | null;
}