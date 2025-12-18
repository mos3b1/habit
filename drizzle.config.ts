// drizzle.config.ts

/**
 * Drizzle Kit Configuration
 * 
 * This file configures drizzle-kit CLI tools:
 * - drizzle-kit generate: Creates migration files from schema changes
 * - drizzle-kit push: Applies schema directly to database (dev only!)
 * - drizzle-kit studio: Opens database GUI
 */

import { defineConfig } from 'drizzle-kit';
import * as dotenv from 'dotenv';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

// Verify we have database URL
if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined');
}

export default defineConfig({
  // Where our schema is defined
  schema: './src/lib/db/schema.ts',
  
  // Where to output migration files
  out: './drizzle',
  
  // Database type
  dialect: 'postgresql',
  
  // Database connection
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
  
  // Verbose output for debugging
  verbose: true,
  
  // Ask for confirmation before destructive changes
  strict: true,
});