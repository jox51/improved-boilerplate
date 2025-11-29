import { SocialLinks as SocialLinksType } from "@/types";

interface SocialLinksProps {
    socialLinks: SocialLinksType;
}

// SVG Icons for each platform
const YouTubeIcon = () => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
);

const TwitterIcon = () => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
);

const TikTokIcon = () => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
    </svg>
);

const FacebookIcon = () => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
);

const InstagramIcon = () => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12.017 0C8.396 0 7.989.013 7.041.048 6.094.082 5.52.204 5.036.388a5.918 5.918 0 0 0-2.14 1.393A5.918 5.918 0 0 0 .503 4.921c-.184.484-.306 1.058-.34 2.005C.128 7.874.115 8.281.115 11.902c0 3.621.013 4.028.048 4.976.034.947.156 1.521.34 2.005a5.918 5.918 0 0 0 1.393 2.14 5.918 5.918 0 0 0 2.14 1.393c.484.184 1.058.306 2.005.34.948.035 1.355.048 4.976.048 3.621 0 4.028-.013 4.976-.048.947-.034 1.521-.156 2.005-.34a5.918 5.918 0 0 0 2.14-1.393 5.918 5.918 0 0 0 1.393-2.14c.184-.484.306-1.058.34-2.005.035-.948.048-1.355.048-4.976 0-3.621-.013-4.028-.048-4.976-.034-.947-.156-1.521-.34-2.005a5.918 5.918 0 0 0-1.393-2.14A5.918 5.918 0 0 0 19.078.388c-.484-.184-1.058-.306-2.005-.34C16.125.013 15.718 0 12.097 0h-.08zm-.05 2.168c3.536 0 3.954.013 5.35.048.292.013.45.064.555.107.14.054.24.119.345.224.105.105.17.205.224.345.043.105.094.263.107.555.035 1.396.048 1.814.048 5.35 0 3.536-.013 3.954-.048 5.35-.013.292-.064.45-.107.555-.054.14-.119.24-.224.345a.926.926 0 0 1-.345.224c-.105.043-.263.094-.555.107-1.396.035-1.814.048-5.35.048-3.536 0-3.954-.013-5.35-.048a1.077 1.077 0 0 1-.555-.107.926.926 0 0 1-.345-.224.926.926 0 0 1-.224-.345c-.043-.105-.094-.263-.107-.555-.035-1.396-.048-1.814-.048-5.35 0-3.536.013-3.954.048-5.35.013-.292.064-.45.107-.555.054-.14.119-.24.224-.345a.926.926 0 0 1 .345-.224c.105-.043.263-.094.555-.107 1.396-.035 1.814-.048 5.35-.048zm0 3.68a5.349 5.349 0 1 0 0 10.698 5.349 5.349 0 0 0 0-10.698zm0 8.821a3.473 3.473 0 1 1 0-6.946 3.473 3.473 0 0 1 0 6.946zm6.815-9.055a1.25 1.25 0 1 1-2.5 0 1.25 1.25 0 0 1 2.5 0z"/>
    </svg>
);

const LinkedInIcon = () => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
);

export default function SocialLinks({ socialLinks }: SocialLinksProps) {
    const platforms = [
        {
            name: 'YouTube',
            url: socialLinks.youtube,
            icon: YouTubeIcon,
            color: 'hover:text-red-600',
            bgColor: 'hover:bg-red-50'
        },
        {
            name: 'Twitter',
            url: socialLinks.twitter,
            icon: TwitterIcon,
            color: 'hover:text-blue-500',
            bgColor: 'hover:bg-blue-50'
        },
        {
            name: 'TikTok',
            url: socialLinks.tiktok,
            icon: TikTokIcon,
            color: 'hover:text-black',
            bgColor: 'hover:bg-gray-50'
        },
        {
            name: 'Facebook',
            url: socialLinks.facebook,
            icon: FacebookIcon,
            color: 'hover:text-blue-600',
            bgColor: 'hover:bg-blue-50'
        },
        {
            name: 'Instagram',
            url: socialLinks.instagram,
            icon: InstagramIcon,
            color: 'hover:text-pink-600',
            bgColor: 'hover:bg-pink-50'
        },
        {
            name: 'LinkedIn',
            url: socialLinks.linkedin,
            icon: LinkedInIcon,
            color: 'hover:text-blue-700',
            bgColor: 'hover:bg-blue-50'
        }
    ];

    // Only show platforms that have custom URLs (not default homepage URLs)
    const activePlatforms = platforms.filter(platform => {
        const defaultUrls = [
            'https://www.youtube.com',
            'https://www.twitter.com',
            'https://www.tiktok.com',
            'https://www.facebook.com',
            'https://www.instagram.com',
            'https://www.linkedin.com'
        ];
        return !defaultUrls.includes(platform.url);
    });

    // If no custom URLs are set, show all platforms with default URLs
    const platformsToShow = activePlatforms.length > 0 ? activePlatforms : platforms;

    return (
        <div className="bg-slate-900/50 rounded-xl border border-slate-800 p-6 backdrop-blur-sm">
            <h3 className="text-lg font-semibold text-slate-100 mb-2 flex items-center">
                <svg className="w-5 h-5 mr-2 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Follow Us
            </h3>
            <p className="text-sm text-slate-400 mb-4">
                Stay connected with us on social media for the latest updates and insights.
            </p>
            <div className="grid grid-cols-3 gap-3">
                {platformsToShow.map((platform) => {
                    const IconComponent = platform.icon;
                    return (
                        <a
                            key={platform.name}
                            href={platform.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex flex-col items-center justify-center p-3 rounded-lg border border-slate-700 bg-slate-800/50 text-slate-300 transition-all duration-200 hover:text-teal-400 hover:bg-slate-800 hover:border-teal-500/50 group"
                            title={`Follow us on ${platform.name}`}
                        >
                            <IconComponent />
                            <span className="text-xs font-medium mt-1 group-hover:font-semibold">
                                {platform.name}
                            </span>
                        </a>
                    );
                })}
            </div>
        </div>
    );
}