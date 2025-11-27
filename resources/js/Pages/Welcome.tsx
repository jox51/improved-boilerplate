import React, { useEffect } from "react";
import { PageProps } from "@/types";
import { Head } from "@inertiajs/react";
import Layout from "@/Components/LandingPage/Layout";
import HeroSection from "@/Components/LandingPage/HeroSection";
import FeaturesSection from "@/Components/LandingPage/FeaturesSection";
import HowItWorksSection from "@/Components/LandingPage/HowItWorksSection";
import PricingSection from "@/Components/LandingPage/PricingSection";
import TestimonialsSection from "@/Components/LandingPage/TestimonialsSection";
import FAQSection from "@/Components/LandingPage/FAQSection";
import FinalCTASection from "@/Components/LandingPage/FinalCTASection";
import {
    initAOS,
    initSmoothScroll,
    observeAndAnimateTickers,
} from "@/utils/landingPageUtils";
import { initializeGTM } from "@/utils/gtmUtils";

export default function Welcome({
    auth,
    laravelVersion,
    phpVersion,
    gtmId,
    appName,
    paymentProviders,
}: PageProps<{
    laravelVersion: string;
    phpVersion: string;
    gtmId: string;
    appName: string;
    paymentProviders: {
        stripe_enabled: boolean;
        paypal_enabled: boolean;
        whop_enabled: boolean;
        default: string;
    };
}>) {
    useEffect(() => {
        initAOS();
        initSmoothScroll();
        observeAndAnimateTickers();

        initializeGTM(gtmId, {
            pageType: "welcomePageLoad",
        });
    }, []);

    // How it works steps
    const steps = [
        {
            number: 1,
            title: "Connect Your Accounts",
            description:
                "Link your accounts securely using API keys for real-time data access and seamless integration.",
        },
        {
            number: 2,
            title: "Set Your Preferences",
            description:
                "Configure filters, customize settings, and set up notification preferences to match your needs.",
        },
        {
            number: 3,
            title: "Start Using",
            description:
                "Receive instant alerts and notifications for important updates and take action when needed.",
        },
    ];

    return (
        <>
            <Head title={appName}>
                <meta
                    name="description"
                    content="A powerful platform that helps you manage and optimize your workflow with advanced features and real-time insights."
                />
                <meta
                    name="keywords"
                    content="platform, dashboard, analytics, automation, workflow, productivity, management, tools, software, application, service, solution"
                />
                <meta name="author" content="Your Company" />
                <meta name="robots" content="index, follow" />
                <meta name="googlebot" content="index, follow" />
                <meta name="bingbot" content="index, follow" />
                <meta name="yandexbot" content="index, follow" />
                <meta name="duckduckbot" content="index, follow" />
                <meta name="sitemap" content="/sitemap.xml" />
            </Head>
            <Layout laravelVersion={laravelVersion} phpVersion={phpVersion}>
                <div>
                    <HeroSection
                        isSubscribed={
                            auth.user?.has_active_subscription || false
                        }
                        isAuthenticated={!!auth.user}
                    />

                    <FeaturesSection />

                    <HowItWorksSection title="How It Works" steps={steps} />

                    <PricingSection
                        isAuthenticated={!!auth.user}
                        isUserSubscribed={
                            auth.user?.has_active_subscription || false
                        }
                        stripeEnabled={paymentProviders.stripe_enabled}
                        paypalEnabled={paymentProviders.paypal_enabled}
                        whopEnabled={paymentProviders.whop_enabled}
                        defaultPaymentProvider={
                            paymentProviders.default as "stripe" | "paypal" | "whop"
                        }
                    />

                    <TestimonialsSection />

                    <FAQSection />

                    <FinalCTASection />
                </div>
            </Layout>
        </>
    );
}
