import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { HandleToggle } from "./client/handletoggle";
import TrashBinMinimalistic2Bold from "./client/trashIcon";
import EditButtonServerWrapper from "./client/EditButtonServerWrapper";
import { cn } from "@/lib/utils";
import { getUser } from "@/server/user";

// interface UserTableProps {
//   // user: User[];
//   onEdit: (user: User) => void;
// }

export default async function ComponentTable() {
  const user = await getUser();

  if (!user) {
    return <p>Unable to fetch user right now</p>;
  }

  const totalBalance = user.reduce(
    (acc, curr) => acc + Number(curr.balance),
    0
  );

  return (
    <div>
      <Table>
        <TableCaption>A list of your recent invoice</TableCaption>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>Email</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Password</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Balance</TableHead>
            <TableHead>Dates</TableHead>
            <TableHead className="text-right">Options</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="w-full">
          {user.map((item) => (
            <TableRow key={item.id} className="w-full ">
              <TableCell>{item.email}</TableCell>
              <TableCell className="font-medium">{item.username}</TableCell>
              <TableCell>
                <HandleToggle password={item.password} />
              </TableCell>
              <TableCell>
                <div
                  className={cn("inline-flex p-2 items-center rounded-lg ", {
                    "bg-emerald-50 text-emerald-700 ring-emerald-600/20":
                      item.status === "Active",
                    "bg-red-50 text-red-700 ring-red-600/20":
                      item.status === "Banned",
                    "bg-amber-50 text-amber-700 ring-amber-600/20":
                      item.status === "Pending",
                    "bg-gray-50 text-gray-700 ring-gray-600/20":
                      item.status === "Inactive",
                  })}
                >
                  {item.status}
                </div>
              </TableCell>
              <TableCell>{item.location}</TableCell>
              <TableCell>{item.balance}</TableCell>
              <TableCell>
                {/* <Button variant="ghost" size="sm" onClick={() => onEdit(user)}>
                  Edit
                </Button> */}
              </TableCell>
              <TableCell>{item.createdAt?.toLocaleDateString()}</TableCell>
              <TableCell className="text-right flex items-center justify-end gap-2">
                <TrashBinMinimalistic2Bold
                  size="18"
                  className="text-red-600"
                  deleteId={item.id}
                />

                <EditButtonServerWrapper id={item.id} size="18" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter className="bg-transparent">
          <TableRow className="hover:bg-transparent">
            <TableCell colSpan={4}>Total</TableCell>
            <TableCell className="text-right">
              {/* ${totalBalance.toFixed(3)} */}
              {totalBalance.toLocaleString(undefined, {
                style: "currency",
                currency: "GBP",
              })}
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
}
