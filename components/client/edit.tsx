"use client";

import { z } from "zod";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import React from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
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
import { useForm } from "react-hook-form";
import { Form } from "../ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../ui/button";
import { updateUser } from "@/server/user";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  username: z.string().min(2).max(50),
  email: z.email(),
  location: z.string().min(1, "Please select a location"),
  status: z.string().min(3),
  balance: z.number(),
  password: z.string().optional(),
});

export const formatNumber = (num?: number) => {
  if (num === undefined || num === null) return "";
  return num.toLocaleString(); // e.g., 1234567 → "1,234,567"
};

export type TextEditStyleProps = React.SVGProps<SVGSVGElement> & {
  size: string;
  editId: string;
  initialData?: Partial<z.infer<typeof formSchema>>;
};

const TextEditStyle = ({
  size,
  initialData,
  editId,
  ...props
}: TextEditStyleProps) => {
  const [open, setOpen] = React.useState(false);

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

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: initialData?.username || "",
      email: initialData?.email || "",
      balance: initialData?.balance || 0,
      location: initialData?.location || "",
      status: initialData?.status || "",
      password: initialData?.password || "", // Add password to defaultValues
    },
    mode: "onChange",
  });

  // console.log(initialData);

  const { isSubmitting } = form.formState;
  const route = useRouter();

  const upDate = async (values: z.infer<typeof formSchema>) => {
    try {
      await updateUser({
        id: editId,
        username: values.username,
        email: values.email,
        balance: String(values.balance),
        status: values.status,
        password: values.password || "",
        location: values.location,
      });
      route.refresh();
      setOpen(false);
    } catch (error) {
      console.error("Failed to update user:", error);
    }
  };

  return (
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={() => setOpen(!open)}
            className="bg-transparent hover:bg-neutral-200 p-2 rounded-full cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={size}
              height={size}
              viewBox="0 0 24 24"
              {...props}
            >
              <path
                fill="none"
                stroke="#000000"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="m3.25 14.25l1.875-4.403m0 0h6.75m-6.75 0l2.873-6.748a.536.536 0 0 1 1.004 0l2.873 6.748m0 0l.575 1.349m.886 9.49a2.5 2.5 0 0 0 1.219-.673l5.454-5.45a2.526 2.526 0 1 0-3.57-3.573l-5.453 5.452c-.335.336-.569.76-.674 1.222l-.536 2.354a1.007 1.007 0 0 0 1.206 1.206z"
              />
            </svg>
          </button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Edit Me 😉</p>
        </TooltipContent>
      </Tooltip>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Item</DialogTitle>
            <DialogDescription>
              This action will Update the item. winks
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(upDate)} className="space-y-8">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Edit your Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Your Email" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Edit Your Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your Username" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="balance"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Edit Your balance</FormLabel>
                    <FormControl>
                      {/* <Input placeholder="Your your balance" {...field} /> */}
                      <Input
                        type="text" // use text to control formatting
                        placeholder="Your Balance"
                        value={formatNumber(field.value ?? "")}
                        onChange={(e) => {
                          const val = e.target.value;

                          // allow empty input
                          if (val === "") {
                            field.onChange(undefined); // keep undefined when empty
                            return;
                          }

                          // remove leading zeros
                          let numeric = val.replace(/^0+/, "");

                          // allow only digits
                          numeric = numeric.replace(/[^0-9]/g, "");

                          // convert to number
                          field.onChange(Number(numeric));
                        }}
                      />
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
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className="w-full">
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
              {/* <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Edit Your Status</FormLabel>
                    <FormControl>
                      <Input placeholder="Your Status" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              /> */}
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Enter your Status</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className="w-full">
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
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Edit Your Password</FormLabel>
                    <FormControl>
                      <Input placeholder="Your Password" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className=" flex items-center gap-x-4">
                <Button
                  className="cursor-pointer"
                  disabled={isSubmitting}
                  type="submit"
                >
                  {isSubmitting ? "Saving" : "Save"}
                </Button>
                <Button
                  className="cursor-pointer"
                  onClick={() => setOpen(false)}
                  variant={"outline"}
                  type="button"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
};
export default TextEditStyle;
