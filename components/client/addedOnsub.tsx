"use client";

import React, { useState } from "react";
import UserForm from "../form/user-form";

import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { UserSample } from "@/db/schema";
// import { SignIn } from "../components/auth/signin-button";

function AddOnSuc() {
  const [open, setOpen] = React.useState(false);
  const [selectedUser, setSelectedUser] = useState<UserSample | null>(null);

  // const handleEdit = (user: User) => {
  //   setOpen(true);
  //   setSelectedUser(user);
  // };

  const handleClose = () => {
    setSelectedUser(null);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="cursor-pointer"
          onClick={() => setSelectedUser(null)} // Reset selection when adding new user
        >
          {selectedUser ? "Edit User" : "Add User"}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>
          {selectedUser ? "Edit user details" : "Enter new user details"}
        </DialogTitle>
        <DialogDescription>
          {selectedUser
            ? "Update the form below to modify the user's information."
            : "Fill in the form below to add a new user to the system."}
        </DialogDescription>
        <UserForm
          mode={selectedUser ? "update" : "create"}
          userId={selectedUser?.id}
          initialData={
            selectedUser
              ? { ...selectedUser, balance: Number(selectedUser.balance) }
              : undefined
          }
          onSuccess={handleClose}
        />
      </DialogContent>
    </Dialog>
  );
}

export default AddOnSuc;
