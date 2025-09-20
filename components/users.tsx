import { auth } from "@/auth";
import ComponentTable from "./comp-466";
import { redirect } from "next/navigation";

export async function UserTable() {
  const user = await auth();

  if (!user) {
    redirect("/login");
  }
  return (
    <div>
      <ComponentTable />
    </div>
  );
}

export default UserTable;
