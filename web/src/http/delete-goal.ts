export default async function deleteGoal(goalId: string) {
  await fetch('http://localhost:3333/delete-goal', {
    method: 'POST',
    headers: {
      "Content-Type": 'application/json',
    },
    body: JSON.stringify({
      goalId,
    })
  })
}