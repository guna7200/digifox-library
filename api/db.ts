import { neon } from '@neondatabase/serverless';

const DEFAULT_URL =
  'postgresql://neondb_owner:npg_tiGx2FhNW4Yz@ep-flat-boat-beqzbeyy-pooler.c-9.us-east-2.aws.neon.tech/neondb?sslmode=require';

export function getSql() {
  const connectionString = process.env.DATABASE_URL || DEFAULT_URL;
  return neon(connectionString);
}
