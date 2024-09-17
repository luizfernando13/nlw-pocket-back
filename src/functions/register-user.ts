import { db } from '../db';
import { users } from '../db/schema';
import bcrypt from 'bcrypt';
import { eq } from 'drizzle-orm';

interface RegisterUserRequest {
  email: string;
  password: string;
}

export async function registerUser({ email, password }: RegisterUserRequest) {
  const existingUser = await db.select().from(users).where(eq(users.email, email)).limit(1);
  if (existingUser.length > 0) {
    throw new Error('Email já está em uso.');
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const insertResult = await db.insert(users).values({
    email,
    passwordHash,
  }).returning();

  return insertResult[0];
}
