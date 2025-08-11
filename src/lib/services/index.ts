// Service layer exports for CanonCore franchise organisation platform
import { UniverseService } from './universe.service';
import { ContentService } from './content.service';
import { UserService } from './user.service';
import { RelationshipService } from './relationship.service';
import { userProgressService } from './user-progress.service';

// Export service classes
export { UniverseService } from './universe.service';
export { ContentService } from './content.service';
export { UserService } from './user.service';
export { RelationshipService } from './relationship.service';
export { userProgressService } from './user-progress.service';

// Create service instances for easy import
export const universeService = new UniverseService();
export const contentService = new ContentService();
export const userService = new UserService();
export const relationshipService = new RelationshipService();