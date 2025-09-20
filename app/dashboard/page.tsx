import { auth } from "@/auth";
import { SignOut } from "@/components/components/auth/register-form";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const session = await auth();
  if (!session) redirect("/login");
  return (
    <main className="p-8">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <SignOut />
    </main>
  );
}
