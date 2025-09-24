// import { auth } from "@/auth";
// import Update from "@/components/client/Update";
// import { buttonVariants } from "@/components/ui/button";
// import { cn } from "@/lib/utils";
// import Image from "next/image";

// export default async function UserAvatar() {
//   const session = await auth();

//   if (!session?.user) return null;

//   return (
//     <div>
//       {!session.user.image ? (
//         <div className={cn(buttonVariants({ variant: "secondary" }))}>
//           {session.user.name?.charAt(0).toUpperCase()}
//         </div>
//       ) : (
//         <div className="flex items-center gap-x-1.5">
//           <Image
//             className="w-9 h-9 rounded-lg"
//             src={session.user.image!}
//             alt="User Avatar"
//             width={800}
//             height={800}
//           />
//           <p className="font-semibold">{session.user.name}</p>
//           {/* <Update user={session.user.id!} /> */}
//         </div>
//       )}
//     </div>
//   );
// }

"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

type User = {
  id: string;
  name: string;
  email?: string;
  image?: string;
};

export default function UserAvatar() {
  const { data: session, status, update } = useSession();
  const [user, setUser] = useState<User | null>(null);
  // const route = useRouter();

  const refreshUserData = async () => {
    if (session?.user.id) {
      // Force session refresh to get updated data from database
      await update();
    }
  };
  // Initialize user from session
  useEffect(() => {
    if (session?.user) {
      setUser({
        id: session.user.id,
        name: session.user.name!,
        email: session.user.email!,
        image: session.user.image!,
      });
    }
    // route.refresh();
  }, [session]);

  useEffect(() => {
    const handleUserUpdate = () => {
      refreshUserData();
    };

    window.addEventListener("userProfileUpdated", handleUserUpdate);

    return () => {
      window.removeEventListener("userProfileUpdated", handleUserUpdate);
    };
  }, [session]);

  if (!user) return null;

  return (
    <div className="flex items-center gap-x-2">
      {!user.image ? (
        <div className={cn(buttonVariants({ variant: "secondary" }))}>
          {user.name.charAt(0).toUpperCase()}
        </div>
      ) : (
        <Image
          className="w-9 h-9 rounded-lg"
          src={user.image}
          alt="User Avatar"
          width={36}
          height={36}
        />
      )}
      <p className="font-semibold">{user.name}</p>
    </div>
  );
}

{
  /* <UpdateForm
        user={user.id}
        onUserUpdate={(updatedUser) => setUser(updatedUser)} // update immediately
      /> */
}

// "use client";

// import React, { useState, useEffect } from "react";
// import { auth } from "@/auth";
// import { cn } from "@/lib/utils";
// import { buttonVariants } from "@/components/ui/button";
// import Image from "next/image";
// import Update from "@/components/client/Update";
// import UpdateForm from "../UpdateForm";

// export default function UserAvatar() {
//   const [user, setUser] = useState<{
//     id: string;
//     name: string;
//     image?: string;
//   } | null>(null);

//   // useEffect(() => {
//   //   auth().then((session) => {
//   //     if (session?.user)
//   //       setUser(session.user as { name: string; id: string; image?: string });
//   //   });
//   // }, []);

//   // Fetch session on mount
//   useEffect(() => {
//     const fetchUser = async () => {
//       const session = await auth();
//       if (session?.user)
//         setUser(session.user as { name: string; id: string; image?: string });
//     };
//     fetchUser();
//   }, []);

//   if (!user) return null;

//   return (
//     <div className="flex items-center gap-x-2">
//       {!user?.image ? (
//         <div className={cn(buttonVariants({ variant: "secondary" }))}>
//           {user.name?.charAt(0).toUpperCase()}
//         </div>
//       ) : (
//         <Image
//           className="w-9 h-9 rounded-lg"
//           src={user.image!}
//           alt="User Avatar"
//           width={36}
//           height={36}
//         />
//       )}
//       <p className="font-semibold">{user.name}</p>
//       <UpdateForm
//         user={user.id}
//         onUserUpdate={(updatedUser) => setUser(updatedUser)}
//       />
//       {/* <Update /> */}
//     </div>
//   );
// }
