#!/usr/bin/env node

/**
 * Data Scanner for CanonCore Development
 * 
 * This script scans Firestore collections to help with debugging and development.
 * Run with: npm run scan-data [options]
 * 
 * Options:
 *   --users          Show users collection
 *   --universes      Show universes collection  
 *   --content        Show content collection
 *   --relationships  Show contentRelationships collection
 *   --progress       Show userProgress collection
 *   --all            Show all collections (default)
 *   --user-id=<id>   Filter by specific user ID
 *   --universe-id=<id> Filter by specific universe ID
 *   --summary        Show only summary counts
 *   --tree           Show hierarchical tree view with progress validation
 *   --validate       Validate data integrity and cross-references
 */

// Load environment variables from .env.local
require('dotenv').config({ path: '.env.local' });

const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');

// Initialize Firebase Admin 
let app;
let db;

// Try different authentication methods
const serviceAccountPath = path.join(__dirname, '..', '.firebase', 'service-account-key.json');

try {
  let credential;
  
  // Method 1: Service account key file
  if (fs.existsSync(serviceAccountPath)) {
    console.log('Using service account key file...');
    const serviceAccount = require(serviceAccountPath);
    credential = admin.credential.cert(serviceAccount);
  } 
  // Method 2: Application default credentials
  else {
    console.log('Using application default credentials...');
    credential = admin.credential.applicationDefault();
  }
  
  app = admin.initializeApp({
    credential: credential,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
  });
  db = admin.firestore();
  console.log('Firebase Admin SDK initialized successfully!');
} catch (error) {
  console.error('Failed to initialize Firebase Admin:', error.message);
  console.error('\nTo fix this:');
  console.error('1. Download service account key from Firebase Console and save as .firebase/service-account-key.json');
  console.error('2. Or run: gcloud auth application-default login');
  console.error('3. See FIREBASE_SETUP.md for detailed instructions');
  process.exit(1);
}

// Parse command line arguments
const args = process.argv.slice(2);
const options = {
  users: false,
  universes: false,
  content: false,
  relationships: false,
  progress: false,
  all: true,
  userId: null,
  universeId: null,
  summary: false,
  tree: false,
  validate: false
};

args.forEach(arg => {
  if (arg === '--users') options.users = true;
  if (arg === '--universes') options.universes = true;
  if (arg === '--content') options.content = true;
  if (arg === '--relationships') options.relationships = true;
  if (arg === '--progress') options.progress = true;
  if (arg === '--all') options.all = true;
  if (arg === '--summary') options.summary = true;
  if (arg === '--tree') options.tree = true;
  if (arg === '--validate') options.validate = true;
  if (arg.startsWith('--user-id=')) options.userId = arg.split('=')[1];
  if (arg.startsWith('--universe-id=')) options.universeId = arg.split('=')[1];
});

// If specific options are set, disable 'all'
if (options.users || options.universes || options.content || options.relationships || options.progress) {
  options.all = false;
}

async function scanCollection(collectionName, filter = null) {
  try {
    let query = db.collection(collectionName);
    
    // Apply filters
    if (filter) {
      if (filter.userId && ['universes', 'content', 'contentRelationships', 'userProgress'].includes(collectionName)) {
        query = query.where('userId', '==', filter.userId);
      }
      if (filter.universeId && ['content', 'contentRelationships', 'userProgress'].includes(collectionName)) {
        query = query.where('universeId', '==', filter.universeId);
      }
    }
    
    const snapshot = await query.get();
    const docs = [];
    
    snapshot.forEach(doc => {
      const data = doc.data();
      
      // Convert Firestore timestamps to readable dates
      if (data.createdAt && data.createdAt.toDate) {
        data.createdAt = data.createdAt.toDate().toISOString();
      }
      if (data.updatedAt && data.updatedAt.toDate) {
        data.updatedAt = data.updatedAt.toDate().toISOString();
      }
      if (data.lastAccessedAt && data.lastAccessedAt.toDate) {
        data.lastAccessedAt = data.lastAccessedAt.toDate().toISOString();
      }
      
      docs.push({
        id: doc.id,
        ...data
      });
    });
    
    return docs;
  } catch (error) {
    console.error(`Error scanning ${collectionName}:`, error.message);
    return [];
  }
}

function printSummary(collectionName, docs) {
  console.log(`\n=== ${collectionName.toUpperCase()} (${docs.length} items) ===`);
  
  if (docs.length === 0) {
    console.log('  (empty)');
    return;
  }
  
  // Collection-specific summaries
  if (collectionName === 'users') {
    docs.forEach(doc => {
      console.log(`  ${doc.id}: ${doc.displayName || 'No name'} (${doc.email || 'No email'})`);
    });
  }
  
  if (collectionName === 'universes') {
    docs.forEach(doc => {
      const visibility = doc.isPublic ? 'Public' : 'Private';
      const progress = typeof doc.progress === 'number' ? `${Math.round(doc.progress)}%` : 'No progress';
      console.log(`  ${doc.id}: "${doc.name}" by ${doc.userId} (${visibility}, ${progress})`);
    });
  }
  
  if (collectionName === 'content') {
    const viewable = docs.filter(d => d.isViewable);
    const organisational = docs.filter(d => !d.isViewable);
    console.log(`  Viewable: ${viewable.length}, Organisational: ${organisational.length}`);
    
    docs.forEach(doc => {
      const type = doc.isViewable ? 'VIEWABLE' : 'ORG';
      const progress = typeof doc.progress === 'number' ? ` (${Math.round(doc.progress)}%)` : '';
      console.log(`  ${doc.id}: [${type}] "${doc.name}" (${doc.mediaType})${progress}`);
    });
  }
  
  if (collectionName === 'contentRelationships') {
    docs.forEach(doc => {
      console.log(`  ${doc.id}: ${doc.contentId} → parent: ${doc.parentId} (order: ${doc.displayOrder || 0})`);
    });
  }
  
  if (collectionName === 'userProgress') {
    docs.forEach(doc => {
      console.log(`  ${doc.id}: User ${doc.userId} - Content ${doc.contentId}: ${doc.progress}%`);
    });
  }
  
  if (collectionName === 'favourites') {
    docs.forEach(doc => {
      console.log(`  ${doc.id}: User ${doc.userId} - ${doc.targetType} ${doc.targetId}`);
    });
  }
}

function printDetailed(collectionName, docs) {
  console.log(`\n=== ${collectionName.toUpperCase()} DETAILED (${docs.length} items) ===`);
  
  if (docs.length === 0) {
    console.log('  (empty)');
    return;
  }
  
  docs.forEach(doc => {
    console.log(`\n--- ${doc.id} ---`);
    console.log(JSON.stringify(doc, null, 2));
  });
}

async function main() {
  console.log('🔍 CanonCore Data Scanner');
  console.log('========================');
  
  if (options.userId) console.log(`Filtering by User ID: ${options.userId}`);
  if (options.universeId) console.log(`Filtering by Universe ID: ${options.universeId}`);
  
  const filter = {
    userId: options.userId,
    universeId: options.universeId
  };
  
  const collections = [];
  
  if (options.all || options.users) collections.push('users');
  if (options.all || options.universes) collections.push('universes');
  if (options.all || options.content) collections.push('content');
  if (options.all || options.relationships) collections.push('contentRelationships');
  if (options.all || options.progress) collections.push('userProgress');
  if (options.all) collections.push('favourites');
  
  for (const collectionName of collections) {
    const docs = await scanCollection(collectionName, filter);
    
    if (options.summary) {
      printSummary(collectionName, docs);
    } else {
      printDetailed(collectionName, docs);
    }
  }
  
  // Print useful stats
  console.log('\n=== SUMMARY STATS ===');
  for (const collectionName of collections) {
    const docs = await scanCollection(collectionName, filter);
    console.log(`${collectionName}: ${docs.length} documents`);
  }
  
  // Show enhanced analysis if requested
  if (options.tree || options.validate) {
    await showEnhancedAnalysis();
  }

  console.log('\nScan complete! 🎉');
  process.exit(0);
}

// Enhanced analysis functions
async function showEnhancedAnalysis() {
  console.log('\n==========================================');
  console.log('🔍 ENHANCED ANALYSIS');
  console.log('==========================================');

  const filter = {
    userId: options.userId,
    universeId: options.universeId
  };

  // Get all data we need for analysis
  const universes = await scanCollection('universes', filter);
  const content = await scanCollection('content', filter);
  const relationships = await scanCollection('contentRelationships', filter);
  const userProgress = await scanCollection('userProgress', filter);

  if (options.tree) {
    await showHierarchyTrees(universes, content, relationships, userProgress);
  }

  if (options.validate) {
    await validateDataIntegrity(universes, content, relationships, userProgress);
  }
}

async function showHierarchyTrees(universes, content, relationships, userProgress) {
  console.log('\n=== HIERARCHICAL TREES ===');
  
  for (const universe of universes) {
    console.log(`\n📁 Universe: ${universe.name} (${universe.id})`);
    console.log(`   Progress: ${Math.round(universe.progress || 0)}%`);
    
    // Get content for this universe
    const universeContent = content.filter(c => c.universeId === universe.id);
    const universeRelationships = relationships.filter(r => r.universeId === universe.id);
    const universeProgress = userProgress.filter(p => p.universeId === universe.id);
    
    if (universeContent.length === 0) {
      console.log('   (no content)');
      continue;
    }
    
    // Build hierarchy tree
    const tree = buildHierarchyTree(universeContent, universeRelationships);
    
    // Show tree structure
    tree.forEach(node => {
      printTreeNode(node, universeContent, universeProgress, 1);
    });
    
    // Show orphaned content
    const orphaned = findOrphanedContent(universeContent, universeRelationships);
    if (orphaned.length > 0) {
      console.log('\n   🚨 ORPHANED CONTENT (no parent):');
      orphaned.forEach(item => {
        const progress = getContentProgress(item, universeProgress);
        const progressStr = progress !== null ? ` (${progress}%)` : '';
        console.log(`   └── [${item.mediaType}] ${item.name}${progressStr}`);
      });
    }
  }
}

function buildHierarchyTree(content, relationships) {
  // Create content lookup
  const contentMap = new Map(content.map(c => [c.id, c]));
  
  // Group relationships by parent
  const childrenMap = new Map();
  relationships.forEach(rel => {
    if (!childrenMap.has(rel.parentId)) {
      childrenMap.set(rel.parentId, []);
    }
    childrenMap.get(rel.parentId).push(rel);
  });
  
  // Find root nodes (parents that aren't children)
  const childIds = new Set(relationships.map(r => r.contentId));
  const rootIds = relationships
    .map(r => r.parentId)
    .filter(id => !childIds.has(id) && contentMap.has(id));
  
  // Build tree recursively
  const buildNode = (contentId) => {
    const children = childrenMap.get(contentId) || [];
    return {
      contentId,
      content: contentMap.get(contentId),
      children: children
        .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0))
        .map(child => buildNode(child.contentId))
    };
  };
  
  return rootIds.map(buildNode);
}

function printTreeNode(node, allContent, userProgress, depth) {
  if (!node.content) return;
  
  const indent = '   ' + '│  '.repeat(depth - 1);
  const connector = depth === 1 ? '├── ' : '├── ';
  const progress = getContentProgress(node.content, userProgress);
  
  let progressStr = '';
  if (node.content.isViewable && progress !== null) {
    progressStr = ` (${progress}% watched)`;
  } else if (!node.content.isViewable && typeof node.content.calculatedProgress === 'number') {
    progressStr = ` (${Math.round(node.content.calculatedProgress)}% complete)`;
  }
  
  console.log(`${indent}${connector}[${node.content.mediaType}] ${node.content.name}${progressStr}`);
  
  // Print children
  node.children.forEach((child, index) => {
    printTreeNode(child, allContent, userProgress, depth + 1);
  });
}

function findOrphanedContent(content, relationships) {
  const hasParent = new Set(relationships.map(r => r.contentId));
  return content.filter(c => !hasParent.has(c.id));
}

function getContentProgress(content, userProgress) {
  if (!content.isViewable) return null;
  const progressEntry = userProgress.find(p => p.contentId === content.id);
  return progressEntry ? progressEntry.progress : (content.progress || 0);
}

async function validateDataIntegrity(universes, content, relationships, userProgress) {
  console.log('\n=== DATA VALIDATION ===');
  
  let issueCount = 0;
  
  // Validate universe references
  console.log('\n🔍 Checking universe references...');
  const universeIds = new Set(universes.map(u => u.id));
  
  content.forEach(c => {
    if (!universeIds.has(c.universeId)) {
      console.log(`   ❌ Content "${c.name}" (${c.id}) references missing universe: ${c.universeId}`);
      issueCount++;
    }
  });
  
  relationships.forEach(r => {
    if (!universeIds.has(r.universeId)) {
      console.log(`   ❌ Relationship (${r.id}) references missing universe: ${r.universeId}`);
      issueCount++;
    }
  });
  
  userProgress.forEach(p => {
    if (!universeIds.has(p.universeId)) {
      console.log(`   ❌ UserProgress (${p.id}) references missing universe: ${p.universeId}`);
      issueCount++;
    }
  });
  
  // Validate content references
  console.log('\n🔍 Checking content references...');
  const contentIds = new Set(content.map(c => c.id));
  
  relationships.forEach(r => {
    if (!contentIds.has(r.contentId)) {
      console.log(`   ❌ Relationship (${r.id}) references missing child content: ${r.contentId}`);
      issueCount++;
    }
    if (!contentIds.has(r.parentId)) {
      console.log(`   ❌ Relationship (${r.id}) references missing parent content: ${r.parentId}`);
      issueCount++;
    }
  });
  
  userProgress.forEach(p => {
    if (!contentIds.has(p.contentId)) {
      console.log(`   ❌ UserProgress (${p.id}) references missing content: ${p.contentId}`);
      issueCount++;
    }
  });
  
  // Validate progress calculations
  console.log('\n🔍 Checking progress calculations...');
  for (const universe of universes) {
    const universeContent = content.filter(c => c.universeId === universe.id);
    const universeRelationships = relationships.filter(r => r.universeId === universe.id);
    const universeProgress = userProgress.filter(p => p.universeId === universe.id);
    
    // Check organisational content calculated progress
    universeContent.filter(c => !c.isViewable).forEach(orgContent => {
      const children = getChildrenContent(orgContent.id, universeContent, universeRelationships);
      const viewableChildren = children.filter(c => c.isViewable);
      
      if (viewableChildren.length > 0) {
        const expectedProgress = calculateExpectedProgress(viewableChildren, universeProgress);
        const actualProgress = Math.round(orgContent.calculatedProgress || 0);
        
        if (Math.abs(expectedProgress - actualProgress) > 1) {
          console.log(`   ⚠️  "${orgContent.name}" calculated progress: expected ${expectedProgress}%, actual ${actualProgress}%`);
          issueCount++;
        }
      }
    });
  }
  
  // Summary
  console.log(`\n📊 VALIDATION SUMMARY`);
  if (issueCount === 0) {
    console.log('   ✅ No data integrity issues found!');
  } else {
    console.log(`   ❌ Found ${issueCount} data integrity issues`);
  }
}

function getChildrenContent(parentId, content, relationships) {
  const childIds = relationships
    .filter(r => r.parentId === parentId)
    .map(r => r.contentId);
  
  return content.filter(c => childIds.includes(c.id));
}

function calculateExpectedProgress(viewableChildren, userProgress) {
  if (viewableChildren.length === 0) return 0;
  
  const total = viewableChildren.reduce((sum, child) => {
    const progress = getContentProgress(child, userProgress);
    return sum + (progress || 0);
  }, 0);
  
  return Math.round(total / viewableChildren.length);
}

// Handle errors
process.on('unhandledRejection', (error) => {
  console.error('Unhandled error:', error);
  process.exit(1);
});

main().catch(console.error);