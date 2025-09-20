"use client";

import { z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Form,
} from "../ui/form";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { createuser, updateUser } from "@/server/user";
import React from "react";

const formSchema = z.object({
  username: z.string().min(2).max(50),
  email: z.email(),
  location: z.string().min(1, "Please select a location"),
  status: z.string().min(3),
  balance: z.number(),
  password: z.string().optional(),
});

interface UserFormProps {
  onSuccess?: () => void;
  initialData?: Partial<z.infer<typeof formSchema>>;
  mode: "create" | "update";
  userId?: string;
}

export default function UserForm({
  onSuccess,
  initialData,
}: // mode,
// userId,
UserFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: initialData?.username || "",
      email: initialData?.email || "",
      balance: initialData?.balance || 0,
      location: initialData?.location || "",
      status: initialData?.status || "",
    },
    mode: "onChange", // Validate on change
  });

  const { isSubmitting } = form.formState;

  function generatePassword(length: number = 12): string {
    return Array.from({ length }, () => {
      const chars =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?";
      return chars[Math.floor(Math.random() * chars.length)];
    }).join("");
  }

  // function generatePassword(length: number = 12): string {
  //   const charset = {
  //     numbers: "0123456789",
  //     lowercase: "abcdefghijklmnopqrstuvwxyz",
  //     uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  //     special: "!@#$%^&*()_+-=[]{}|;:,.<>?",
  //   };

  //   let password = "";

  //   // Ensure at least one character from each set
  //   password +=
  //     charset.numbers[Math.floor(Math.random() * charset.numbers.length)];
  //   password +=
  //     charset.lowercase[Math.floor(Math.random() * charset.lowercase.length)];
  //   password +=
  //     charset.uppercase[Math.floor(Math.random() * charset.uppercase.length)];
  //   password +=
  //     charset.special[Math.floor(Math.random() * charset.special.length)];

  //   // Fill the rest of the password
  //   const allChars = Object.values(charset).join("");
  //   for (let i = password.length; i < length; i++) {
  //     password += allChars[Math.floor(Math.random() * allChars.length)];
  //   }

  //   // Shuffle the password
  //   return password
  //     .split("")
  //     .sort(() => Math.random() - 0.5)
  //     .join("");
  // }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const result = await createuser({
        ...values,
        balance: String(values.balance),
        password: generatePassword(12), // Generate a random password
      });

      if (result && "success" in result && result.success) {
        form.reset();
        onSuccess?.();
      }

      // if (mode === "create") {
      //   result = await createuser({
      //     ...values,
      //     balance: String(values.balance),
      //     password: generatePassword(12), // Generate a random password
      //   });
      // } else {
      //   // Handle error

      //   result = await updateUser({
      //     ...values,
      //     id: userId!,
      //     balance: String(values.balance),
      //     password: values.password || initialData?.password || "",
      //   });
      //   // console.error(result?.error);
      // }

      // if (result && "success" in result && result.success) {
      //   form.reset();
      //   onSuccess?.(); // Call the success callback
      //   // Show success message
      // }
    } catch (error) {
      console.error("Failed to submit:", error);
    }
  }

  const locations = [
    "New York",
    "Los Angeles",
    "Chicago",
    "Houston",
    "Phoenix",
    "Philadelphia",
    "San Antonio",
    "San Diego",
    "Dallas",
    "San Jose",
  ];

  const statuses = ["Active", "Inactive", "Pending", "Banned"];

  // function selectYourLocation() {
  //   return (
  //     <select
  //       title="Select your location"
  //       className="w-full p-2 border border-gray-300 rounded-md"
  //     >
  //       {locations.map((location) => (
  //         <option key={location} value={location}>
  //           {location}
  //         </option>
  //       ))}
  //     </select>
  //   );
  // }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="Enter your name" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="balance"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Enter your balance</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Your Balance"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Enter your email</FormLabel>
              <FormControl>
                <Input placeholder="Your Email" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Enter your Location</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select a Location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Enter your City</SelectLabel>
                      {locations.map((location) => (
                        <SelectItem key={location} value={location}>
                          {location}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Enter your Status</FormLabel>
              <FormControl>
                {/* 
                
                <Input placeholder="Your location" {...field} /> */}

                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select a Status" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Enter a Status</SelectLabel>
                      {statuses.map((stat) => (
                        <SelectItem key={stat} value={stat}>
                          {stat}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          className="cursor-pointer"
          disabled={isSubmitting}
          type="submit"
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </Button>
      </form>
    </Form>
  );
}
