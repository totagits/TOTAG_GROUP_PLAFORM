import dotenv from "dotenv";
dotenv.config();

import pg from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from "@shared/schema";

const { Pool } = pg;

const databaseUrl = process.env.DATABASE_URL || "postgresql://totaguser:Zwedru4@gedeh@localhost:5432/totaggroup";

if (!process.env.DATABASE_URL) {
  console.warn("⚠️ DATABASE_URL not set in process.env - using totaguser default connection.");
}

export const pool = new Pool({ connectionString: databaseUrl });
export const db = drizzle(pool, { schema });