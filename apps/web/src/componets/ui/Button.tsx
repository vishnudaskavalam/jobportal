import React from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger' | 'link' | 'sidebar' | 'sidebarActive';
export type ButtonSize = 'sm' | 'md' | 'lg' | 'icon';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-[0_0_15px_rgba(16,185,129,0.2)] hover:shadow-[0_0_25px_rgba(16,185,129,0.3)]',
  secondary: 'bg-slate-900 border border-white/5 hover:bg-slate-800 text-slate-300 hover:text-slate-100',
  outline: 'bg-transparent border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10',
  ghost: 'bg-transparent text-slate-400 hover:text-slate-200 hover:bg-white/5',
  danger: 'bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20',
  link: 'bg-transparent text-slate-400 hover:text-emerald-400 p-0',
  sidebar: 'bg-transparent text-slate-400 hover:text-slate-200 hover:bg-white/5 justify-start',
  sidebarActive: 'bg-emerald-500/10 text-emerald-400 justify-start',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2.5 text-sm font-medium',
  lg: 'px-6 py-3 text-base font-bold',
  icon: 'w-10 h-10 p-0 flex items-center justify-center',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  isLoading = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center gap-2 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer';
  
  const combinedClassName = `
    ${baseStyles}
    ${variantStyles[variant]}
    ${variant === 'link' ? '' : sizeStyles[size]}
    ${fullWidth ? 'w-full' : ''}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  return (
    <button className={combinedClassName} disabled={disabled || isLoading} {...props}>
      {isLoading ? (
        <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle className="opacity-25" cx="12" cy="12" r="10" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ) : leftIcon}
      {children}
      {rightIcon && !isLoading && rightIcon}
    </button>
  );
}
