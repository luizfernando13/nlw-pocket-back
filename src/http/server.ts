// server.ts

import fastify from "fastify";
import fastifyJwt from "@fastify/jwt";
import fastifyCors from "@fastify/cors";
import z from "zod";
import { serializerCompiler, validatorCompiler, type ZodTypeProvider } from "fastify-type-provider-zod";
import { createGoalRoute } from "./routes/create-goal";
import { createCompletionRoute } from "./routes/create-completion";
import { getPendingGoalsRoute } from "./routes/get-pending-goals";
import { getWeekSummaryRoute } from "./routes/get-week-summary";
import { undoCompletionRoute } from "./routes/undo-completion";
import { deleteGoalRoute } from "./routes/delete-goal";
import { registerRoute } from "./routes/register";
import { loginRoute } from "./routes/login";
import { env } from "../env";

declare module "fastify" {
  interface FastifyInstance {
    authenticate: any;
  }
}

const app = fastify().withTypeProvider<ZodTypeProvider>();

app.register(fastifyCors, {
  origin: '*',
});

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

// Registrando o plugin JWT
app.register(fastifyJwt, {
  secret: env.JWT_SECRET, // Certifique-se de adicionar JWT_SECRET ao seu arquivo .env
});

// Método de autenticação
app.decorate("authenticate", async function (request, reply) {
  try {
    await request.jwtVerify();
  } catch (err) {
    reply.status(401).send({ error: "Token inválido ou ausente" });
  }
});

// Rotas públicas
app.register(registerRoute);
app.register(loginRoute);

// Rotas protegidas
app.register(async function (protectedRoutes) {
  protectedRoutes.addHook("onRequest", app.authenticate);

  protectedRoutes.register(createGoalRoute);
  protectedRoutes.register(createCompletionRoute);
  protectedRoutes.register(getPendingGoalsRoute);
  protectedRoutes.register(getWeekSummaryRoute);
  protectedRoutes.register(undoCompletionRoute);
  protectedRoutes.register(deleteGoalRoute);
}, { prefix: '/protected' });

app.listen({
  port: env.PORT || 3333,
  host: '0.0.0.0'
}).then(() => {
  console.log(`Server running on port ${env.PORT}!!! 🚀`);
});
