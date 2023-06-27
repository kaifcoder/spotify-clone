import React from "react";
import { twMerge } from "tailwind-merge";
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, disabled, type = "button", className, ...props }, ref) => {
    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled}
        className={twMerge(
          `w-full rounded-full bg-green-500 px-3 py-3 disabled:cursor-not-allowed font-bold text-black hover:opacity-75 border border-transparent disabled:opacity-50 transition`,
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "button";

export default Button;
