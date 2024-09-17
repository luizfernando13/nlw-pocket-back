import { FastifyPluginAsync } from "fastify";
import { registerUser } from "../../functions/register-user";
import z from "zod";

export const registerRoute: FastifyPluginAsync = async (app) => {
  app.post('/register', {
    schema: {
      body: z.object({
        email: z.string().email(),
        password: z.string().min(6),
      }),
    },
  }, async (request, reply) => {
    const { email, password } = request.body;
    try {
      await registerUser({ email, password });
      reply.send({ message: 'Usuário registrado com sucesso.' });
    } catch (error) {
      reply.status(400).send({ error: error.message });
    }
  });
};
