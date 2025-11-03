import React from "react";
import { cn } from "@/lib/utils";

interface FileUploadButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  icon?: React.ReactNode;
}

export const FileUploadButton = React.forwardRef<HTMLButtonElement, FileUploadButtonProps>(
  ({ children, icon, className, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "border-none flex items-center justify-center gap-3",
          "px-6 py-3 bg-[#488aec] text-white",
          "text-xs font-bold uppercase tracking-wide text-center",
          "cursor-pointer select-none rounded-lg",
          "shadow-[0_4px_6px_-1px_rgba(72,138,236,0.19),0_2px_4px_-1px_rgba(72,138,236,0.09)]",
          "transition-all duration-[600ms] ease-in-out",
          "hover:shadow-[0_10px_15px_-3px_rgba(72,138,236,0.31),0_4px_6px_-2px_rgba(72,138,236,0.09)]",
          "focus:opacity-85 focus:shadow-none active:opacity-85 active:shadow-none",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          className
        )}
        {...props}
      >
        {icon && <span className="w-5 h-5">{icon}</span>}
        {children}
      </button>
    );
  }
);

FileUploadButton.displayName = "FileUploadButton";
