import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema"; // Importa o esquema das tabelas
import { env } from "../env"; // Importa variáveis de ambiente
import { createTablesAndSeed } from "./seed"; // Importa a função para criar as tabelas e executar o seed

export const client = postgres(env.DATABASE_URL); // Inicializa o cliente PostgreSQL
export const db = drizzle(client, { schema, logger: true }); // Inicializa o Drizzle ORM

async function initializeDatabase() {
  try {
    console.log("Criando tabelas e executando seeds...");
    await createTablesAndSeed(client); // Passa o cliente diretamente
    console.log("Tabelas criadas e seeds executados com sucesso.");
  } catch (error) {
    console.error("Erro ao criar tabelas ou executar seeds:", error);
  } finally {
    client.end(); // Finaliza a conexão com o banco de dados
  }
}

// Inicializa o banco de dados quando o aplicativo começar
initializeDatabase();
