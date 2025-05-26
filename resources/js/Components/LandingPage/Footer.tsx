import React from "react";
import { Link } from "@inertiajs/react";

interface FooterProps {
    laravelVersion?: string;
    phpVersion?: string;
    appName: string;
}

const Footer: React.FC<FooterProps> = ({
    laravelVersion = "12.15.0",
    phpVersion = "8.3.21",
    appName,
}) => {
    return (
        <footer className="bg-gray-900 border-t border-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <a
                            href="https://google.com/"
                            className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-4 block"
                        >
                            <i className="fas fa-chart-line mr-2"></i>
                            {appName}
                        </a>
                        <p className="text-gray-400 mb-4 max-w-md">
                            Discover profitable crypto arbitrage opportunities
                            across multiple exchanges with real-time alerts and
                            advanced filtering.
                        </p>
                        <div className="text-sm text-gray-500">
                            Powered by Laravel v{laravelVersion} (PHP v
                            {phpVersion})
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="mb-4">
                            <Link
                                href={route("terms")}
                                className="text-gray-400 hover:text-white transition-colors duration-200"
                            >
                                Terms
                            </Link>
                            <span className="text-gray-600 mx-2">|</span>
                            <Link
                                href={route("privacy.policy")}
                                className="text-gray-400 hover:text-white transition-colors duration-200"
                            >
                                Privacy Policy
                            </Link>
                            <span className="text-gray-600 mx-2">|</span>
                            <Link
                                href={route("contact.show")}
                                className="text-gray-400 hover:text-white transition-colors duration-200"
                            >
                                Contact Us
                            </Link>
                        </div>
                        <div className="text-gray-500">
                            © 2025 {appName}. All rights reserved.
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
