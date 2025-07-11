import { TextareaHTMLAttributes } from 'react';

export default function Textarea({ className = '', style, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      style={{ ...style, fontSize: 'var(--tool-font-size)' }}
      className={`input-base p-4 ${className}`}
    />
  );
}
