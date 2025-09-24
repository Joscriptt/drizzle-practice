import { auth } from "@/auth";
import ComponentTable from "./comp-466";
import { redirect } from "next/navigation";
import Update from "./client/Update";

export async function UserTable() {
  const user = await auth();

  if (!user) {
    redirect("/login");
  }
  return (
    <div>
      <ComponentTable />
      <Update />
    </div>
  );
}

export default UserTable;
