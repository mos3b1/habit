// src/lib/db/test-connection.ts
require('dotenv').config({ path: '.env.local' });
import { db, users } from './index';

async function testConnection() {
  console.log('🔍 Testing database connection...\n');
  
  try {
    const result = await db.select().from(users).limit(1);
    console.log('✅ Database connection successful!');
    console.log(`   Found ${result.length} users\n`);
    
    console.log('📋 Tables created:');
    console.log('   - users');
    console.log('   - habits');
    console.log('   - habit_logs\n');
    
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
  }
}

testConnection();