import React, { forwardRef } from "react";
import { twMerge } from "tailwind-merge";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, disabled, ...props }, ref) => {
    return (
      <input
        type={type}
        disabled={disabled}
        className={twMerge(
          `
        flex
        w-full
        rounded-md
        bg-neutral-700
        border border-transparent px-3 py-3 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium
        placeholder-neutral-400
        focus:outline-none
        disabled:cursor-not-allowed
        disabled:opacity-50
    `,
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

export default Input;