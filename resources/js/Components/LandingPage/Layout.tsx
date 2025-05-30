import React from "react";
import { usePage } from "@inertiajs/react";
import NavigationBar from "./NavigationBar";
import Footer from "./Footer";
import { PageProps } from "@/types";

interface LayoutProps {
    children: React.ReactNode;
    laravelVersion?: string;
    phpVersion?: string;
}

const Layout: React.FC<LayoutProps> = ({
    children,
    laravelVersion,
    phpVersion,
}) => {
    const { auth, appName } = usePage<PageProps>().props;

    return (
        <>
            <NavigationBar auth={auth} appName={appName} />
            <main className="bg-gray-900 min-h-screen">{children}</main>
            <Footer
                laravelVersion={laravelVersion}
                phpVersion={phpVersion}
                appName={appName}
            />
        </>
    );
};

export default Layout;
