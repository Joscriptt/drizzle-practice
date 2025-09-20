import AddOnSuc from "@/components/client/addedOnsub";
import SignIn from "@/components/components/auth/signin-button";
import UserAvatar from "@/components/components/auth/UserAvatar";
// import UserForm from "@/components/form/user-form";

// import { signOut, useSession } from "next-auth/react";

import { auth } from "@/auth";

import UserTable from "@/components/users";
import React from "react";
import SignOut from "@/components/components/auth/sign-out";
// import { SignOut } from "@/components/components/auth/register-form";

const session = await auth();

export default async function Home() {
  if (!session)
    return (
      <div className="flex justify-center items-center h-screen">
        <SignIn />
        Not authenticated
      </div>
    );

  return (
    <div>
      {/* <pre> {JSON.stringify(users, null, 2)}</pre> */}
      <div className="xl:max-w-[1400px] max-w-[700px] mx-auto mt-36">
        <div className="flex justify-between items-center mb-7">
          <UserAvatar />
          {session.user?.id && <SignOut />}
        </div>
        <div className="text-right">
          <AddOnSuc />
        </div>
        {session.user?.id && <UserTable />}
      </div>
    </div>
  );
}
