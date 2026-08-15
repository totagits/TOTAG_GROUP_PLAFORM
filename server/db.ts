import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

const databaseUrl = process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/totaggroup";

if (!process.env.DATABASE_URL) {
  console.warn("⚠️ DATABASE_URL not set. Operating with fallback storage mode.");
}

export const pool = new Pool({ connectionString: databaseUrl });
export const db = drizzle({ client: pool, schema });