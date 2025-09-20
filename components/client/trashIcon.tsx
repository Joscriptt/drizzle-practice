"use client";

import { deleteUser } from "@/server/user";
import React, { useRef } from "react";
import { useRouter } from "next/navigation";

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

import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

type TrashBinMinimalistic2BoldProps = React.SVGProps<SVGSVGElement> & {
  size: string;
  deleteId: string;
};

const TrashBinMinimalistic2Bold = ({
  deleteId,
  size,
  ...props
}: TrashBinMinimalistic2BoldProps) => {
  const [progress, setProgress] = React.useState(0);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const progressInterval = useRef<NodeJS.Timeout>(null!);
  const router = useRouter();
  const [isPending, startTransition] = React.useTransition();

  // async function handleDelte() {
  //   await deleteUser(deleteId);
  // }

  const handleDelete = () => {
    setIsDeleting(true);
    setOpen(true);
    setProgress(0);

    progressInterval.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval.current);
          // Finish on next tick to avoid updating Router during render
          queueMicrotask(async () => {
            await deleteUser(deleteId);
            startTransition(() => {
              router.refresh();
            });
            setIsDeleting(false);
            setOpen(false);
          });
          return 0;
        }
        return prev + 1.67; // Will reach 100 in roughly 60 iterations
      });
    }, 50); // Updates every 50ms
  };

  const handleCancel = () => {
    clearInterval(progressInterval.current);
    setIsDeleting(false);
    setOpen(false);
    setProgress(0);
  };

  return (
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            // onClick={handleDelte}
            onClick={handleDelete}
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
                fill="currentColor"
                d="M3 6.524c0-.395.327-.714.73-.714h4.788c.006-.842.098-1.995.932-2.793A3.68 3.68 0 0 1 12 2a3.68 3.68 0 0 1 2.55 1.017c.834.798.926 1.951.932 2.793h4.788c.403 0 .73.32.73.714a.722.722 0 0 1-.73.714H3.73A.722.722 0 0 1 3 6.524ZM11.607 22h.787c2.707 0 4.06 0 4.94-.863c.881-.863.971-2.28 1.151-5.111l.26-4.08c.098-1.537.146-2.306-.295-2.792c-.442-.487-1.188-.487-2.679-.487H8.23c-1.491 0-2.237 0-2.679.487c-.441.486-.392 1.255-.295 2.791l.26 4.08c.18 2.833.27 4.249 1.15 5.112C7.545 22 8.9 22 11.607 22Z"
              />
            </svg>
          </button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Delete Forever</p>
        </TooltipContent>
      </Tooltip>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Deleting Item</DialogTitle>
            <DialogDescription>
              This action will be completed in 3 seconds. Click cancel to abort.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Progress value={progress} className="w-full" />
            <div className="flex justify-end">
              <Button
                variant="destructive"
                onClick={handleCancel}
                disabled={!isDeleting}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
export default TrashBinMinimalistic2Bold;
