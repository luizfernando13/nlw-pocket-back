import { and, count, eq, gte, lte, sql } from 'drizzle-orm'
import { db } from '../db'
import { goalCompletions, goals } from '../db/schema'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault("America/Sao_Paulo");

interface CreateGoalCompletionRequest {
  goalId: string
}

export async function createGoalCompletion({
  goalId,
}: CreateGoalCompletionRequest) {
  const firstDayOfWeek = dayjs().startOf('week').tz('America/Sao_Paulo').toDate();
  const lastDayOfWeek = dayjs().endOf('week').tz('America/Sao_Paulo').toDate();

  const nowTz = dayjs().tz('America/Sao_Paulo').format();  // Gera uma string com a data em UTC-3

  console.log("Now (São Paulo):", nowTz); // Com fuso horário, deverá estar em UTC-3

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

  // Agora salvando diretamente a data com o fuso horário correto em formato string
  const insertResult = await db
    .insert(goalCompletions)
    .values({
      goalId,
      createdAt: nowTz,  // Salvando como string formatada em UTC-3
    })
    .returning();

  const goalCompletion = insertResult[0];
  console.log("Inserted Goal Completion:", goalCompletion);

  return {
    goalCompletion,
  };
}
