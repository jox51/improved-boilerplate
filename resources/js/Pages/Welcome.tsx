import React, { useEffect } from "react";
import { PageProps } from "@/types";
import { Head } from "@inertiajs/react";
import TagManager from "@sooro-io/react-gtm-module";
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

export default function Welcome({
    auth,
    laravelVersion,
    phpVersion,
    gtmId,
}: PageProps<{ laravelVersion: string; phpVersion: string; gtmId: string }>) {
    useEffect(() => {
        initAOS();
        initSmoothScroll();
        observeAndAnimateTickers();

        TagManager.initialize({
            gtmId: gtmId,
            dataLayer: {
                pageType: "welcomePageLoad",
            },
        });
    }, []);

    // How it works steps
    const steps = [
        {
            number: 1,
            title: "Connect Your Exchanges",
            description:
                "Link your exchange accounts securely using API keys for real-time data access.",
        },
        {
            number: 2,
            title: "Set Your Preferences",
            description:
                "Configure filters for trading pairs, minimum profit margins, and notification preferences.",
        },
        {
            number: 3,
            title: "Start Earning",
            description:
                "Receive instant alerts for profitable arbitrage opportunities and execute trades.",
        },
    ];

    return (
        <>
            <Head title="Arbitrage Screener">
                <meta
                    name="description"
                    content="Arbitrage Screener is a tool that helps you find profitable arbitrage opportunities in the crypto market."
                />
                <meta
                    name="keywords"
                    content="crypto arbitrage, crypto trading, crypto arbitrage bot, crypto arbitrage strategy, crypto arbitrage opportunities, crypto arbitrage calculator, crypto arbitrage finder, crypto arbitrage scanner, crypto arbitrage tool, crypto arbitrage software, crypto arbitrage platform, crypto arbitrage service, crypto arbitrage app, crypto arbitrage tool, crypto arbitrage software, crypto arbitrage platform, crypto arbitrage service, crypto arbitrage app"
                />
                <meta name="author" content="Arbscreener" />
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
                    />

                    <TestimonialsSection />

                    <FAQSection />

                    <FinalCTASection />
                </div>
            </Layout>
        </>
    );
}
