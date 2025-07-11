import { InputHTMLAttributes } from 'react';

export default function Input({ className = '', style, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      style={{ ...style, fontSize: 'var(--tool-font-size)' }}
      className={`input-base ${className}`}
    />
  );
}
