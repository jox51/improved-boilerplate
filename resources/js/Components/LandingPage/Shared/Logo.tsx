import React from 'react';
import { Link } from '@inertiajs/react';

interface LogoProps {
    src?: string;
    alt?: string;
    href?: string;
    className?: string;
}

const Logo: React.FC<LogoProps> = ({
    src,
    alt = 'Arbscreener',
    href = '/',
    className = '',
}) => {
    const baseClasses = 'flex items-center';
    const combinedClasses = `${baseClasses} ${className}`;
    
    const logoContent = src ? (
        <img src={src} alt={alt} className="h-8 w-auto" />
    ) : (
        <div className="text-2xl font-bold text-blue-600">
            Arbscreener
        </div>
    );
    
    if (href) {
        return (
            <Link href={href} className={combinedClasses}>
                {logoContent}
            </Link>
        );
    }
    
    return (
        <div className={combinedClasses}>
            {logoContent}
        </div>
    );
};

export default Logo;