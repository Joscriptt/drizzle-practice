// export { auth } from "@/auth";
"use server";

import { db } from "@/db/drizzle";
import { sampleUsers, users, UserSample, accounts } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { compare, hashSync, hash } from "bcrypt-ts";
import { success } from "zod";

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

export const getAuthUser = async (id: string) => {
  // console.log("getAuthUser called with id 🥒🥒 :", id);

  // First get the user data
  const userData = await db.select().from(users).where(eq(users.id, id));

  // console.log("User data from database:✅", userData);

  if (!userData[0]) {
    // console.log("No user found with id:", id);
    return null;
  }

  // Then check if they have any OAuth accounts
  const accountData = await db
    .select({ provider: accounts.provider })
    .from(accounts)
    .where(eq(accounts.userId, id));

  // console.log("Account data from database:", accountData);

  // If they have an account, use the provider, otherwise they're a credential user
  const provider = accountData.length > 0 ? accountData[0].provider : null;

  // console.log("Final provider value:", provider);

  return {
    ...userData[0],
    provider,
  };
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
      // return newUser;
      return serializedUser;
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

// export async function UpdateAuthUser(
//   id: string,
//   name: string,
//   email: string,
//   image: string,
//   currentPassword?: string,
//   newPassword?: string
// ) {
//   try {
//     const userss = await db.select().from(users).where(eq(users.id, id));

//     if (!userss[0]) {
//       throw new Error("User not found");
//     }

//     const currentUser = userss[0];

//     // If updating password, verify current password first
//     if (newPassword && currentPassword) {
//       if (!currentUser.password) {
//         // throw new Error("No password set for this user");
//         throw new Error("User has no password set (OAuth user)");
//       }
//     }

//     const checkPasswordMatch = await compare(
//       currentPassword!,
//       currentUser.password!
//     );

//     if (!checkPasswordMatch) {
//       throw new Error("Current password is incorrect");
//     }

//     const hashedNewPassword = await hashSync(newPassword!, 10);

//     const insertNewUserDetailsInToDatabase = await db
//       .update(users)
//       .set({
//         name: name,
//         email: email,
//         image: image,
//         password: newPassword ? hashedNewPassword : currentUser.password,
//       })
//       .where(eq(users.id, id));
//     revalidatePath("/");
//     return insertNewUserDetailsInToDatabase;
//     // return { success: true, data: insertNewUserDetailsInToDatabase }

//     //

//     // const checkPasswordmatch = userss[0]?.password === password;
//     // if (!checkPasswordmatch) {
//     //   throw new Error("Password does not match");
//     // }
//     // const insertNewUserDetailsInToDatabase = await db
//     //   .update(users)
//     //   .set({
//     //     name: name,
//     //     email: email,
//     //     image: image,
//     //   })
//     //   .where(eq(users.id, id));
//     // revalidatePath("/");
//     // return insertNewUserDetailsInToDatabase;
//     // // return await db.update(users).set({ name, email, image }).where(eq(users.id, id));
//   } catch (error) {}
// }

// interface UserProfileFormProps {
//   user: {
//     id: string;
//     name: string;
//     email: string;
//     image: string;
//     currentPassword?: string;
//     newPassword?: string;
//     // password?: string | null;
//   };
// }

interface UserProfileFormProps {
  id: string;
  name?: string;
  email?: string;
  // image?: string;
  // currentPassword?: string;
  // newPassword?: string;
  // password?: string | null;
}

export const UpdateAuthUser = async ({
  id,
  name,
  email,
}: // image,
// currentPassword,
// newPassword,
UserProfileFormProps) => {
  // const { id, name, email, image, currentPassword, newPassword } = user;

  // console.log(name, email, image, currentPassword, newPassword);
  const userss = await db.select().from(users).where(eq(users.id, id));

  if (!userss[0]) {
    throw new Error("User not found");
  }

  // const currentUser = userss[0];

  await db
    .update(users)
    .set({
      name: name,
      email: email,
      // image: image,
    })
    .where(eq(users.id, id));

  revalidatePath("/");
};

// try {
//   // Get current user data
//   const userss = await db.select().from(users).where(eq(users.id, id));

//   if (!userss[0]) {
//     throw new Error("User not found");
//   }

//   const currentUser = userss[0];

//    const insertNewUserDetailsInToDatabase = await db
//       .update(users)
//       .set({
//         name: name,
//         email: email,
//         image: image,
//       })
//       .where(eq(users.id, id));

//     revalidatePath("/");
//     return insertNewUserDetailsInToDatabase;

//   // If updating password, verify current password first
//   if (newPassword && currentPassword) {
//     if (!currentUser.password) {
//       throw new Error("User has no password set (OAuth user)");
//     }

//     const checkPasswordMatch = await compare(
//       currentPassword,
//       currentUser.password
//     );
//     if (!checkPasswordMatch) {
//       throw new Error("Current password is incorrect");
//     }

//     const hashedNewPassword = await hash(newPassword, 12);

//     // Update user with new password
//     const insertNewUserDetailsInToDatabase = await db
//       .update(users)
//       .set({
//         name: name,
//         email: email,
//         image: image,
//         // password: hashedNewPassword,
//       })
//       .where(eq(users.id, id));

//     revalidatePath("/");
//     return insertNewUserDetailsInToDatabase;
//   } else {
//     // Update user without changing password
//     const insertNewUserDetailsInToDatabase = await db
//       .update(users)
//       .set({
//         name: name,
//         email: email,
//         image: image,
//       })
//       .where(eq(users.id, id));

//     revalidatePath("/");
//     return insertNewUserDetailsInToDatabase;
//   }
// } catch (error) {
//   console.error("Error updating user:", error);
//   return {
//     success: false,
//     message: error instanceof Error ? error.message : "Failed to update user",
//   };
// }

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
