import { Timestamp } from 'firebase/firestore';

// User interface
export interface User {
  id: string;
  displayName: string | null;
  email: string | null;
  createdAt: Timestamp;
}

// Universe (Franchise) interface
export interface Universe {
  id: string;
  name: string;
  description: string;
  userId: string;
  isPublic: boolean;
  sourceLink?: string;
  sourceLinkName?: string;
  progress?: number;
  contentProgress?: {
    total: number;
    completed: number;
    inProgress: number;
    unstarted: number;
  };
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Content (Franchise Elements) interface
export interface Content {
  id: string;
  name: string;
  description: string;
  universeId: string;
  userId: string;
  isViewable: boolean; // true for episodes/movies, false for characters/locations
  mediaType: 'video' | 'audio' | 'text' | 'character' | 'location' | 'item' | 'event' | 'collection';
  progress?: number; // 0-100, only for viewable content
  calculatedProgress?: number; // calculated from contained viewable content for organisational holders
  lastAccessedAt?: Timestamp;
  isPublic: boolean; // inherited from universe
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Favorites interface
export interface Favorite {
  id: string;
  userId: string;
  targetId: string; // universeId or contentId
  targetType: 'universe' | 'content';
  createdAt: Timestamp;
}

// Content Relationships interface (for hierarchies)
export interface ContentRelationship {
  id: string;
  contentId: string; // child content
  parentId: string; // parent content
  universeId: string;
  userId: string;
  displayOrder?: number;
  contextDescription?: string; // "First appearance", "Main character", etc.
  createdAt: Timestamp;
}

// Form data interfaces for creating content
export interface CreateUniverseData {
  name: string;
  description: string;
  isPublic: boolean;
  sourceLink?: string;
  sourceLinkName?: string;
}

export interface CreateContentData {
  name: string;
  description: string;
  isViewable: boolean;
  mediaType: Content['mediaType'];
}

export interface UpdateContentProgressData {
  progress: number;
  lastAccessedAt?: Timestamp;
}

// Context interfaces
export interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
}

export interface FranchiseContextType {
  universes: Universe[];
  loading: boolean;
  createUniverse: (data: CreateUniverseData) => Promise<Universe>;
  updateUniverse: (id: string, data: Partial<Universe>) => Promise<void>;
  deleteUniverse: (id: string) => Promise<void>;
}