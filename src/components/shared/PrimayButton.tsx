import React from "react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

interface PrimaryButtonProps {
  children: React.ReactNode;
  handler?: () => void;
  className?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}

const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  children,
  handler,
  className = "",
  type = "button",
  disabled = false,
}) => {
  return (
    <Button
      type={type}
      onClick={handler}
      disabled={disabled}
      className={cn(
        "group relative w-full flex justify-center px-4 text-sm font-medium rounded-xl text-white bg-gradient-to-r from-indigo-600 to-purple-700 hover:from-indigo-700 hover:to-purple-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-lg hover:shadow-xl transition-all duration-200 py-6",
        className
      )}
    >
      {children}
    </Button>
  );
};

export default PrimaryButton;
