import React from "react";
import TestimonialCard from "./SocialProof/TestimonialCard";
import ExchangeLogoItem from "./SocialProof/ExchangeLogoItem";

interface Testimonial {
    quote: string;
    authorName: string;
    authorTitle?: string;
    authorImage?: string;
}

interface ExchangeLogo {
    name: string;
    textColorClass: string;
    link?: string;
}

interface SocialProofSectionProps {
    testimonialsTitle?: string;
    testimonials: Testimonial[];
    supportedExchangesTitle?: string;
    exchangeLogos: ExchangeLogo[];
}

const SocialProofSection: React.FC<SocialProofSectionProps> = ({
    testimonialsTitle = "What Our Users Say",
    testimonials,
    supportedExchangesTitle = "Supported Exchanges",
    exchangeLogos,
}) => {
    return (
        <section id="testimonials" className="py-20 bg-stone-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Testimonials */}
                <div className="mb-20">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                            {testimonialsTitle}
                        </h2>
                        <p className="text-xl text-slate-700 max-w-3xl mx-auto">
                            Join thousands of traders who trust Arbscreener
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {testimonials.map((testimonial, index) => (
                            <TestimonialCard
                                key={index}
                                quote={testimonial.quote}
                                authorName={testimonial.authorName}
                                authorTitle={testimonial.authorTitle}
                                authorImage={testimonial.authorImage}
                            />
                        ))}
                    </div>
                </div>

                {/* Supported Exchanges */}
                <div>
                    <div className="text-center mb-12">
                        <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
                            {supportedExchangesTitle}
                        </h3>
                        <p className="text-lg text-slate-700">
                            Monitor arbitrage opportunities across 20+ major
                            exchanges
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                        {exchangeLogos.map((logo, index) => (
                            <ExchangeLogoItem
                                key={index}
                                name={logo.name}
                                textColorClass={logo.textColorClass}
                                link={logo.link}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SocialProofSection;
