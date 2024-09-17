import { FastifyPluginAsync } from "fastify";
import { loginUser } from "../../functions/login-user";
import z from "zod";

export const loginRoute: FastifyPluginAsync = async (app) => {
  app.post('/login', {
    schema: {
      body: z.object({
        email: z.string().email(),
        password: z.string(),
      }),
    },
  }, async (request, reply) => {
    const { email, password } = request.body;
    try {
      const user = await loginUser({ email, password });
      const token = app.jwt.sign({ id: user.id });
      reply.send({ token });
    } catch (error) {
      reply.status(400).send({ error: error.message });
    }
  });
};
