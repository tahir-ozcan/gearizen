import { ReactNode } from 'react';

export default function Card({ className = '', children }: { className?: string; children: ReactNode }) {
  return (
    <div className={`bg-white border border-gray-200 rounded-2xl shadow-sm p-6 ${className}`}>{children}</div>
  );
}
