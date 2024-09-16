import z from 'zod'

console.log(process.env)
const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  PORT: z.coerce.number(),
})

export const env = envSchema.parse(process.env)
