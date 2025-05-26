import React from 'react';
import AppLayout from '@/Layouts/App/AppLayout';

// Define basic PageProps interface for this page
interface PageProps {
    auth?: {
        user?: {
            id: number;
            name: string;
            email: string;
        };
    };
}

export default function Index({ auth }: PageProps) {
    return (
        <AppLayout title="Main App">
            <div className="container mx-auto">
                <h1 className="text-2xl font-semibold text-white mb-6">
                    Welcome to the Arbitrage Screener App!
                </h1>
                <p className="text-gray-300">
                    This is the main application area. The features will be displayed here.
                </p>
                {/* Placeholder for future content */}
                <div className="mt-8 p-6 bg-gray-800 rounded-lg shadow">
                    <p className="text-gray-400">Arbitrage data and tools will appear here soon.</p>
                </div>
            </div>
        </AppLayout>
    );
}