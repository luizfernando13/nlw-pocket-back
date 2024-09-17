import { createGoal } from "../../functions/create-goal";

export const createGoalRoute: FastifyPluginAsyncZod = async (app) => {
  app.post('/goals', {
    schema: {
      body: z.object({
        title: z.string(),
        desiredWeeklyFrequency: z.number().int().min(1).max(7),
      }),
    }
  }, async (request, reply) => {
    const { title, desiredWeeklyFrequency } = request.body;

    console.log('Requisição recebida no back-end:', title, desiredWeeklyFrequency);

    let attempt = 0;
    const maxAttempts = 5;

    while (attempt < maxAttempts) {
      try {
        // Tenta criar a meta no banco de dados
        await createGoal({ title, desiredWeeklyFrequency });
        return reply.status(201).send({ message: 'Meta criada com sucesso!' });
      } catch (error) {
        attempt++;
        console.error(`Erro ao criar a meta na tentativa ${attempt}:`, error);

        if (attempt >= maxAttempts) {
          return reply.status(500).send({
            message: 'Erro ao criar a meta após múltiplas tentativas',
            error: error.message,
          });
        }

        // Espera um tempo antes de tentar novamente
        await new Promise(resolve => setTimeout(resolve, 3000));
      }
    }
  });
};
