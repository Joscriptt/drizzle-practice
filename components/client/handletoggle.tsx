"use client";

import { useState } from "react";
import { EyeClosed } from "lucide-react";

interface HandleToggleProps {
  password: string;
}

export const HandleToggle = ({ password }: HandleToggleProps) => {
  const [show, setShow] = useState(false);
  return (
    <div className="flex items-center gap-x-2 justify-between w-32">
      {show ? password : "••••••••"}
      <EyeClosed
        onClick={() => setShow((prev) => !prev)}
        className="text-sm cursor-pointer"
      />
    </div>
  );
};
