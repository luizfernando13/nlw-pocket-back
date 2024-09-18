import { and, count, eq, gte, lte, sql } from 'drizzle-orm';
import { db } from '../db';
import { goalCompletions, goals } from '../db/schema';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault('America/Sao_Paulo');

interface CreateGoalCompletionRequest {
  goalId: string;
}

export async function createGoalCompletion({
  goalId,
}: CreateGoalCompletionRequest) {
  const firstDayOfWeek = dayjs().startOf('week').tz('America/Sao_Paulo').toDate();
  const lastDayOfWeek = dayjs().endOf('week').tz('America/Sao_Paulo').toDate();

  const nowTz = dayjs().tz('America/Sao_Paulo').format(); // Usar .format() para manter o fuso horário correto como string

  console.log('Now (São Paulo):', nowTz); // Verifica se o fuso horário está correto

  const goalCompletionCounts = db.$with('goal_completion_counts').as(
    db
      .select({
        goalId: goalCompletions.goalId,
        completionCount: count(goalCompletions.id).as('completionCount'),
      })
      .from(goalCompletions)
      .where(
        and(
          gte(goalCompletions.createdAt, firstDayOfWeek),
          lte(goalCompletions.createdAt, lastDayOfWeek),
          eq(goalCompletions.goalId, goalId)
        )
      )
      .groupBy(goalCompletions.goalId)
  );

  const result = await db
    .with(goalCompletionCounts)
    .select({
      desiredWeeklyFrequency: goals.desiredWeeklyFrequency,
      completionCount: sql`
      COALESCE(${goalCompletionCounts.completionCount}, 0)
      `.mapWith(Number),
    })
    .from(goals)
    .leftJoin(goalCompletionCounts, eq(goalCompletionCounts.goalId, goals.id))
    .where(eq(goals.id, goalId))
    .limit(1);

  const { completionCount, desiredWeeklyFrequency } = result[0];

  if (completionCount >= desiredWeeklyFrequency) {
    throw new Error('Goal Already completed this week!');
  }

  // Agora, o `createdAt` será uma string formatada no timezone de São Paulo (UTC-3)
  const insertResult = await db
    .insert(goalCompletions)
    .values({
      goalId,
      createdAt: nowTz, // Salva como string formatada
    })
    .returning();

  const goalCompletion = insertResult[0];
  console.log('Inserted Goal Completion:', goalCompletion);

  return {
    goalCompletion,
  };
}
