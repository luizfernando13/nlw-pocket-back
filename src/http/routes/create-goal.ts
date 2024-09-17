import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import z from "zod";
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

    // Adiciona um log para verificar se o back-end está recebendo a requisição
    console.log('Requisição recebida no back-end:');
    console.log('Título:', title);
    console.log('Frequência semanal desejada:', desiredWeeklyFrequency);

    try {
        // Processa a criação da meta
        await createGoal({
            title,
            desiredWeeklyFrequency,
        });

        // Retorna uma resposta de sucesso
        return reply.status(201).send({ message: 'Meta criada com sucesso!' });
    } catch (error) {
        // Loga o erro no console
        console.error('Erro ao criar a meta:', error);
        return reply.status(500).send({ message: 'Erro ao criar a meta', error: error.message });
    }
});
};
