import React from "react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils"; // Adjust path based on your project

interface SecondaryButtonProps {
  children: React.ReactNode;
  handler?: () => void;
  className?: string;
  type?: "button" | "submit" | "reset";
}

const SecondaryButton: React.FC<SecondaryButtonProps> = ({
  children,
  handler,
  className = "",
  type = "button",
  ...props
}) => {
  return (
    <Button
      type={type}
      variant="secondary"
      onClick={handler}
      className={cn(
        "group relative w-full flex justify-center py-3 px-4 text-sm font-medium rounded-xl text-indigo-700 bg-white border border-indigo-300 hover:bg-indigo-50 hover:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer",
        className
      )}
      {...props}
    >
      {children}
    </Button>
  );
};

SecondaryButton.displayName = "SecondaryButton";

export default SecondaryButton;
