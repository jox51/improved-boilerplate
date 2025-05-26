import React from 'react';
import { Link } from '@inertiajs/react';

interface ButtonProps {
    onClick?: () => void;
    href?: string;
    variant?: 'primary' | 'secondary' | 'outline';
    size?: 'sm' | 'md' | 'lg';
    disabled?: boolean;
    children: React.ReactNode;
    type?: 'button' | 'submit' | 'reset';
    className?: string;
}

const Button: React.FC<ButtonProps> = ({
    onClick,
    href,
    variant = 'primary',
    size = 'md',
    disabled = false,
    children,
    type = 'button',
    className = '',
}) => {
    const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-stone-100';
    
    const variantClasses = {
        primary: 'bg-indigo-600 hover:bg-indigo-700 text-white focus:ring-indigo-500 shadow-lg hover:shadow-xl',
        secondary: 'bg-green-600 hover:bg-green-700 text-white focus:ring-green-500 shadow-lg hover:shadow-xl',
        outline: 'border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white focus:ring-indigo-500 hover:border-indigo-700',
    };
    
    const sizeClasses = {
        sm: 'px-3 py-2 text-sm',
        md: 'px-6 py-3 text-base',
        lg: 'px-8 py-4 text-lg',
    };
    
    const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : '';
    
    const combinedClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabledClasses} ${className}`;
    
    if (href) {
        return (
            <Link
                href={href}
                className={combinedClasses}
            >
                {children}
            </Link>
        );
    }
    
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={combinedClasses}
        >
            {children}
        </button>
    );
};

export default Button;