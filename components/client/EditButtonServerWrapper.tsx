import TextEditStyle from "./edit";
import { getUserById } from "@/server/user";

interface EditButtonServerWrapperProps {
  id: string;
  size: string;
}

export default async function EditButtonServerWrapper({
  id,
  size,
}: EditButtonServerWrapperProps) {
  const user = await getUserById(id);

  return (
    <TextEditStyle
      size={size}
      editId={id}
      initialData={
        user
          ? {
              username: user.username ?? "",
              email: user.email ?? "",
              balance: Number(user.balance ?? 0),
              location: user.location ?? "",
              status: user.status ?? "",
              password: user.password ?? "",
            }
          : undefined
      }
    />
  );
}
