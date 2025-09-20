"use server";

import { redirect } from "next/navigation";
import { createUser, getUser } from "./user";
import { formSchema } from "@/components/components/auth/register-form";
import z from "zod";

export const register = async (data: z.infer<typeof formSchema>) => {
  const user = await getUser(data.email);

  if (user.length > 0) {
    return { message: "A user with this profile already exist" };
  } else {
    await createUser(data.email, data.password, data.name);
    redirect("/");
  }
};
