import { db } from "./index"; // Importa o `db` já inicializado
import { goalCompletions, goals } from "./schema"; // Esquemas das tabelas
import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

// Função para criar as tabelas se não existirem
async function createTables(client: any) {
  await client`
    CREATE TABLE IF NOT EXISTS goals (
      id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
      title TEXT NOT NULL,
      desired_weekly_frequency INTEGER NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `;

  await client`
    CREATE TABLE IF NOT EXISTS goal_completions (
      id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
      goal_id TEXT REFERENCES goals(id) ON DELETE CASCADE NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `;
}

// Função que insere dados nas tabelas
export async function seed() {
  await db.delete(goalCompletions);
  await db.delete(goals);

  const result = await db
    .insert(goals)
    .values([
      { title: "Acordar cedo", desiredWeeklyFrequency: 5 },
      { title: "Me exercitar", desiredWeeklyFrequency: 3 },
      { title: "Meditar", desiredWeeklyFrequency: 1 },
      { title: "Não mexer no celular de noite", desiredWeeklyFrequency: 2 },
    ])
    .returning();

  // Garante que as datas sejam manipuladas no fuso horário correto
  const startOfWeek = dayjs().tz("America/Sao_Paulo").startOf("week");

  await db.insert(goalCompletions).values([
    { goalId: result[0].id, createdAt: startOfWeek.toDate() },
    { goalId: result[1].id, createdAt: startOfWeek.add(1, "day").toDate() },
    { goalId: result[3].id, createdAt: startOfWeek.add(2, "day").toDate() },
  ]);
}
