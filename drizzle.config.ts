import { defineConfig } from "drizzle-orm/postgres-js";
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

export default defineConfig({
  schema: './src/lib/db/schema.ts',
  out: './drizzle',
  driver: 'postgres',
  dbCredentials: {
    connectionString: process.env.DATABASE_URL || '',
  },
});