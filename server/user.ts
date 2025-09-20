// export { auth } from "@/auth";
"use server";

import { db } from "@/db/drizzle";
import { sampleUsers, UserSample } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export const getUser = async () => {
  try {
    return await db.select().from(sampleUsers);
  } catch (error) {
    throw error;
    console.error(error);
  }
};

export const getUserById = async (id: string) => {
  try {
    const result = await db
      .select()
      .from(sampleUsers)
      .where(eq(sampleUsers.id, id));
    return result[0] ?? null;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const createuser = async (
  user: Omit<UserSample, "createdAt" | "updatedAt" | "id">
) =>
  //   email: string,
  //   username: string,
  //   password: string
  {
    const { email, username, password, status, location, balance } = user;
    try {
      const newUser = await db
        .insert(sampleUsers)
        .values({ email, username, password, status, location, balance });
      revalidatePath("/");
      const serializedUser = JSON.parse(JSON.stringify(newUser));
      return { success: true, data: serializedUser };
      return newUser;
    } catch (error) {
      console.error(error);
    }
  };

export const updateUser = async (
  user: Omit<UserSample, "createdAt" | "updatedAt">
) => {
  const { password, username, email, id, location, status, balance } = user;
  try {
    const res = await db
      .update(sampleUsers)
      .set({ email, password, username, location, status, balance })
      .where(eq(sampleUsers.id, id));
    revalidatePath("/");
    const serializedUser = JSON.parse(JSON.stringify(res));
    return { success: true, data: serializedUser };
  } catch (error) {
    console.error(error);
  }
};

export async function deleteUser(id: string) {
  try {
    await db.delete(sampleUsers).where(eq(sampleUsers.id, id));
    revalidatePath("/");
    // const serializedUser = JSON.parse(JSON.stringify(deletedUser));
    // return { success: true, data: serializedUser };
    // return await db.delete(users).where(eq(users.id, id));
  } catch (error) {
    console.error(error);
  }
}
