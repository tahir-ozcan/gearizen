// components/Input.tsx
"use client";

import React, {
  forwardRef,
  ComponentPropsWithoutRef,
} from "react";

export type InputProps = ComponentPropsWithoutRef<"input"> & {
  /** Override the CSS var that controls font size */
  fontSize?: string;
};

/**
 * A fully‐client‐side <input>:
 *  • forwards its ref
 *  • supports all native <input> props (value, onChange, etc)
 *  • uses a CSS var for font-size (customizable via `fontSize`)
 *  • applies your Tailwind theme classes
 */
const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", style, fontSize, ...props }, ref) => (
    <input
      ref={ref}
      {...props}
      style={{ ...style, fontSize: fontSize ?? "var(--tool-font-size)" }}
      className={`
        block w-full bg-white text-gray-900 placeholder-gray-400
        border border-gray-300 rounded-full py-3 px-4
        focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500
        transition ease-in-out duration-200
        ${className}
      `}
    />
  )
);

Input.displayName = "Input";
export default Input;