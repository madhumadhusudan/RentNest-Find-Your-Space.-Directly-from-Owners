import { eq } from 'drizzle-orm';
import { db } from './index.ts';
import { users } from './schema.ts';

export async function getOrCreateUser(uid: string, email: string, name: string) {
  try {
    const result = await db.insert(users)
      .values({ uid, email, name, role: 'Seeker' })
      .onConflictDoUpdate({
        target: users.uid,
        set: { email }, // Update email if it changed, keep name/role
      })
      .returning();
    return result[0];
  } catch (error) {
    console.error("Database query failed:", error);
    throw new Error("Failed to register user.", { cause: error });
  }
}

export async function getUserByUid(uid: string) {
  try {
    const result = await db.select().from(users).where(eq(users.uid, uid));
    return result[0];
  } catch (error) {
    throw new Error("Failed to fetch user.", { cause: error });
  }
}
