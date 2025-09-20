"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
// import { signIn } from "@/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useState } from "react";
import z from "zod";

const FormSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
});

export default function LoginForm() {
  const [isGithubLoading, setIsGithubLoading] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { isLoading, isSubmitting } = form.formState;

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const res = await signIn("credentials", {
      redirect: false,
      email: data.email,
      password: data.password,
    });

    if (res?.error) {
      // toast({
      //   variant: 'destructive',
      //   title: 'Uh oh! Something went wrong.',
      //   description: (res as any).code,
      // });
      toast("Something went wrong");

      form.setError("password", {
        type: "manual",
        message: res?.code || "Login failed",
      });
      // form.setError("password", { type: "manual", message: (res as any).code });
    } else {
      window.location.href = "/";
    }
  }

  return (
    <Card className=" w-full max-w-md ">
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>
          Enter your email below to login to your account
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    {/* <Link href="#" className="ml-auto inline-block text-sm underline">
                        Forgot your password?
                      </Link> */}
                    <FormControl>
                      <Input placeholder="Password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                disabled={isLoading && isSubmitting}
                className="w-full cursor-pointer "
                type="submit"
              >
                {isSubmitting ? "Logging you in" : "Login"}
              </Button>

              <Button
                type="button"
                variant={"outline"}
                className="cursor-pointer mt-2"
                onClick={async () => {
                  setIsGithubLoading(true);
                  try {
                    await signIn("github", {
                      redirectTo: "/",
                    });
                  } finally {
                    setIsGithubLoading(false);
                  }
                }}
                disabled={isGithubLoading || isSubmitting}
              >
                {isGithubLoading ? "Logging In" : "Login with Github"}
              </Button>
            </div>
          </form>
        </Form>

        <div className="mt-4 text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="underline">
            Sign up
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

// CustomePassword

// import { signIn } from "@/auth";
// import { Button } from "@/components/ui/button";

// export function SignIn() {
//   return (
//     <form
//       action={async () => {
//         "use server";
//         await signIn(undefined, { redirectTo: "/dashboard" });
//       }}
//     >
//       <Button variant={"default"} type="submit" className="cursor-pointer">
//         Sign in
//       </Button>
//     </form>
//   );
// }
