
import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: 'primary' | 'secondary' | 'outline';
  disabled?: boolean;
  // Added type prop to support native button types (e.g., 'submit' for forms)
  type?: 'button' | 'submit' | 'reset';
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  onClick, 
  className = "", 
  variant = 'primary', 
  disabled,
  type = 'button'
}) => {
  const baseStyles = "px-6 py-3 rounded-lg font-bold transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-900/20",
    secondary: "bg-zinc-100 hover:bg-white text-zinc-950",
    outline: "border-2 border-purple-600 text-purple-600 hover:bg-purple-600/10"
  };

  return (
    <button 
      type={type}
      disabled={disabled}
      onClick={onClick} 
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};
