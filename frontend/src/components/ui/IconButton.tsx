import React from 'react';

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export const IconButton: React.FC<IconButtonProps> = ({ children, ...props }) => {
  return (
    <button
      className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
      {...props}
    >
      {children}
    </button>
  );
}; 