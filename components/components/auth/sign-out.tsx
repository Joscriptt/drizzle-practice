import { signOut } from "@/auth";
import { Button } from "@/components/ui/button";
import React from "react";

function SignOut() {
  return (
    <form
      action={async () => {
        "use server";
        await signOut();
      }}
    >
      <Button variant={"outline"} className="cursor-pointer" type="submit">
        Sign Out
      </Button>
    </form>
  );
}

export default SignOut;
