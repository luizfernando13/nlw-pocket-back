import { eq } from 'drizzle-orm'
import { db } from '../db'
import { goals, goalCompletions } from '../db/schema'

interface DeleteGoalRequest {
  goalId: string
}

export async function deleteGoal({ goalId }: DeleteGoalRequest) {
  try {
    // Deletar todas as entradas relacionadas em goal_completions
    await db
      .delete(goalCompletions)
      .where(eq(goalCompletions.goalId, goalId))
      .execute()

    // Agora deletar a meta da tabela goals
    const deleteResult = await db
      .delete(goals)
      .where(eq(goals.id, goalId))
      .execute()

    const deletedGoalId = deleteResult[0]

    return {
      message: 'Goal and related completions deleted successfully',
      deletedGoalId: deletedGoalId,
    }
  } catch (error) {
    throw new Error(`Failed to delete goal and completions: ${error.message}`)
  }
}
