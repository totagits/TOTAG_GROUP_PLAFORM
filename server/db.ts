import dotenv from "dotenv";
dotenv.config();

import pg from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from "@shared/schema";

const { Pool } = pg;

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error("DATABASE_URL must be set before starting the TOTAG platform");
}

export const pool = new Pool({ connectionString: databaseUrl });
export const db = drizzle(pool, { schema });