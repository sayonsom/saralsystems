'use client';

import { forwardRef } from 'react';

const Button = forwardRef(({ 
  className = '', 
  variant = 'default', 
  size = 'default',
  asChild = false,
  children,
  ...props 
}, ref) => {
  const baseStyles = 'inline-flex items-center justify-center rounded-none font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';
  
  const variants = {
    default: 'bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-600',
    outline: 'border border-gray-300 bg-transparent hover:bg-gray-100 text-gray-900',
    ghost: 'hover:bg-gray-100 hover:text-gray-900',
  };
  
  const sizes = {
    default: 'h-10 px-4 py-2',
    sm: 'h-9 px-3 text-sm',
    lg: 'h-11 px-8',
  };
  
  const Component = asChild ? 'span' : 'button';
  
  return (
    <Component
      ref={ref}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
});

Button.displayName = 'Button';

export { Button };