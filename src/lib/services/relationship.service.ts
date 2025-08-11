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
    await this.verifyContentOwnership(parentId, userId);
    await this.verifyContentOwnership(contentId, userId);

    const relationshipData = {
      contentId,
      parentId,
      universeId,
      userId,
      displayOrder: displayOrder ?? 0,
      contextDescription,
      createdAt: Timestamp.now()
    };

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

    // Find root nodes (content that are parents but not children)
    const childIds = new Set(relationships.map(rel => rel.contentId));
    const rootIds = relationships
      .map(rel => rel.parentId)
      .filter(id => !childIds.has(id));

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
   * Get content path (breadcrumbs) from root to specific content
   */
  async getContentPath(contentId: string): Promise<ContentRelationship[]> {
    const path: ContentRelationship[] = [];
    let currentContentId = contentId;

    while (true) {
      const parents = await this.getParents(currentContentId);
      if (parents.length === 0) {
        break; // Reached root
      }
      
      // Take first parent (in case of multiple parents)
      const parent = parents[0];
      path.unshift(parent);
      currentContentId = parent.parentId;
    }

    return path;
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
   * Verify content ownership before creating relationships
   */
  private async verifyContentOwnership(contentId: string, userId: string): Promise<void> {
    const contentDoc = await getDoc(doc(db, 'content', contentId));
    
    if (!contentDoc.exists()) {
      throw new Error(`Content ${contentId} not found`);
    }

    const content = contentDoc.data() as Content;
    if (content.userId !== userId) {
      throw new Error(`Access denied to content ${contentId}`);
    }
  }
}

// Helper interface for hierarchy tree building
interface HierarchyNode {
  contentId: string;
  children: HierarchyNode[];
  relationship: ContentRelationship | null;
}