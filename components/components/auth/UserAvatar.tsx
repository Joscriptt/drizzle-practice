import { auth } from "@/auth";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default async function UserAvatar() {
  const session = await auth();

  if (!session?.user) return null;

  return (
    <div>
      {!session.user.image ? (
        <div className={cn(buttonVariants({ variant: "secondary" }))}>
          {session.user.name?.charAt(0).toUpperCase()}
        </div>
      ) : (
        <img
          className="w-9 h-9 rounded-lg"
          src={session.user.image!}
          alt="User Avatar"
        />
      )}
    </div>
  );
}
