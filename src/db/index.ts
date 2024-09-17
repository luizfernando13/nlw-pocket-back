import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";
import { env } from "../env";
import { seed } from './seed'; // Importa o seed

export const client = postgres(env.DATABASE_URL)
export const db = drizzle(client, { schema, logger: true });

async function createTablesAndSeed() {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS goals (
      id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
      title TEXT NOT NULL,
      desired_weekly_frequency INTEGER NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
    
    CREATE TABLE IF NOT EXISTS goal_completions (
      id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
      goal_id TEXT REFERENCES goals(id) ON DELETE CASCADE NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
  `);

  // Chama o seed para popular o banco de dados
  await seed();
}

// Chame a função para criar tabelas e executar o seed
createTablesAndSeed().finally(() => client.end());
