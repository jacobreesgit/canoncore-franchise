#!/usr/bin/env node

// Load environment variables from .env.local
require('dotenv').config({ path: '.env.local' });

const { execSync } = require('child_process');

const collections = [
  'universes',
  'content', 
  'favorites',
  'contentRelationships'
  // Note: We don't delete 'users' collection as it contains auth data
];

function clearCollection(collectionName) {
  console.log(`🗑️  Clearing collection: ${collectionName}`);
  
  try {
    // Use Firebase CLI to delete the collection
    const command = `firebase firestore:delete --project ${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID} --recursive --force "${collectionName}"`;
    
    const output = execSync(command, { 
      encoding: 'utf8', 
      stdio: ['pipe', 'pipe', 'pipe'] 
    });
    
    console.log(`   ✅ Successfully cleared ${collectionName}`);
    
  } catch (error) {
    // Check if error is because collection doesn't exist
    if (error.message.includes('No matching documents')) {
      console.log(`   ✅ Collection ${collectionName} is already empty`);
    } else {
      console.error(`   ❌ Error clearing ${collectionName}:`, error.message);
    }
  }
}

function clearAllData() {
  // Check for --force flag
  const forceFlag = process.argv.includes('--force');
  
  if (!forceFlag) {
    console.error('❌ ERROR: This script requires --force flag to run');
    console.error('Usage: npm run clear-data --force');
    console.error('');
    console.error('This will attempt to DELETE ALL DATA from the following collections:');
    collections.forEach(col => console.error(`  - ${col}`));
    console.error('');
    console.error('⚠️  USER DATA WILL BE PRESERVED (users collection untouched)');
    console.error('');
    console.error('📝 NOTE: This script may fail due to Firestore security rules.');
    console.error('   If you need to clear data, you can:');
    console.error('   1. Use Firebase Console → Firestore → Delete collections manually');
    console.error('   2. Or temporarily update security rules to allow admin access');
    process.exit(1);
  }

  console.log('🚨 CLEARING ALL FIRESTORE DATA (except users)...');
  console.log('');
  
  // Check Firebase config
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  if (!projectId) {
    console.error('❌ Firebase project ID missing. Make sure .env.local is set up.');
    process.exit(1);
  }
  
  console.log(`📁 Project: ${projectId}`);
  console.log('📋 Collections to clear:', collections.join(', '));
  console.log('');
  
  // Clear each collection
  for (const collectionName of collections) {
    clearCollection(collectionName);
  }
  
  console.log('');
  console.log('✅ FIRESTORE CLEAR ATTEMPT COMPLETE!');
  console.log('');
  console.log('📝 If you saw permission errors above:');
  console.log('   - This is expected due to Firestore security rules');
  console.log('   - Use Firebase Console to manually delete collections if needed');
  console.log('   - Or test with existing data (app will still work fine)');
  console.log('');
  console.log('🔄 You can now test with data:');
  console.log('   1. Sign in to create your user profile');
  console.log('   2. Create new universes and content');
  console.log('   3. Test all functionality from scratch');
  
  process.exit(0);
}

// Handle errors
process.on('unhandledRejection', (error) => {
  console.error('❌ Unhandled error:', error);
  process.exit(1);
});

// Run the script
clearAllData();