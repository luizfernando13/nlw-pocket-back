import { db } from '../db';
import { users } from '../db/schema';
import bcrypt from 'bcrypt';
import { eq } from 'drizzle-orm';

interface LoginUserRequest {
  email: string;
  password: string;
}

export async function loginUser({ email, password }: LoginUserRequest) {
  const user = await db.select().from(users).where(eq(users.email, email)).limit(1);

  if (user.length === 0) {
    throw new Error('Credenciais inválidas.');
  }

  const isValidPassword = await bcrypt.compare(password, user[0].passwordHash);

  if (!isValidPassword) {
    throw new Error('Credenciais inválidas.');
  }

  return user[0];
}
