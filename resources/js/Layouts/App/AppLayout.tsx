import React, { PropsWithChildren } from "react";
import { Head, Link } from "@inertiajs/react";

interface AppLayoutProps {
    title?: string;
}

export default function AppLayout({
    title,
    children,
}: PropsWithChildren<AppLayoutProps>) {
    return (
        <>
            {title && <Head title={title} />}
            <div className="min-h-screen flex bg-gray-900 text-white">
                {/* Sidebar */}
                <aside className="w-64 bg-gray-800 p-4 space-y-4 border-r border-gray-700">
                    <div className="text-xl font-semibold mb-6">App Menu</div>
                    {/* Placeholder for menu items */}
                    <nav>
                        <a
                            href="#"
                            className="block py-2 px-3 rounded hover:bg-gray-700"
                        >
                            Dashboard
                        </a>
                        <a
                            href="#"
                            className="block py-2 px-3 rounded hover:bg-gray-700"
                        >
                            Arbitrage Opportunities
                        </a>

                        <a
                            href="#"
                            className="block py-2 px-3 rounded hover:bg-gray-700"
                        >
                            Settings
                        </a>
                        <a
                            href="#"
                            className="block py-2 px-3 rounded hover:bg-gray-700"
                        >
                            Profile
                        </a>
                        <Link
                            href={route("billing.show")}
                            className="block py-2 px-3 rounded hover:bg-gray-700"
                        >
                            Billing
                        </Link>
                    </nav>
                </aside>

                {/* Main Content Area */}
                <main className="flex-1 p-6 overflow-y-auto">{children}</main>
            </div>
        </>
    );
}
