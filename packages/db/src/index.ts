import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";

import * as schema from "./schema/index";

export function isDatabaseConfigured(): boolean {
  return Boolean(process.env.DATABASE_URL);
}

const globalForDb = globalThis as unknown as {
  pool: pg.Pool | undefined;
};

function createPool(): pg.Pool {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL is not set");
  }
  return new pg.Pool({ connectionString: url });
}

export function getPool(): pg.Pool {
  if (!globalForDb.pool) {
    globalForDb.pool = createPool();
  }
  return globalForDb.pool;
}

export function getDb() {
  return drizzle(getPool(), { schema });
}

export type Db = ReturnType<typeof getDb>;

export * from "./schema/index";
