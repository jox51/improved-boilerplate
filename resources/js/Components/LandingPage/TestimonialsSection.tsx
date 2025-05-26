import React from "react";
import SectionHeading from "./Shared/SectionHeading";
import TestimonialCard from "./SocialProof/TestimonialCard";
import ExchangeLogoItem from "./SocialProof/ExchangeLogoItem";

const TestimonialsSection: React.FC = () => {
    // Testimonials data matching the HTML template
    const testimonials = [
        {
            quote: "This platform has revolutionized our workflow. We've increased our efficiency by 40% in just 3 months.",
            authorName: "Alex Chen",
            authorTitle: "Operations Manager",
            authorInitial: "A",
            avatarGradientFrom: "from-blue-500",
            avatarGradientTo: "to-purple-600",
            rating: 5,
            aosDelay: "100",
            hoverBorderColor: "hover:border-green-500/50",
        },
        {
            quote: "The real-time insights are incredibly accurate. We never miss important opportunities anymore.",
            authorName: "Sarah Johnson",
            authorTitle: "Business Analyst",
            authorInitial: "S",
            avatarGradientFrom: "from-pink-500",
            avatarGradientTo: "to-red-600",
            rating: 5,
            aosDelay: "200",
            hoverBorderColor: "hover:border-blue-500/50",
        },
        {
            quote: "Best analytics platform we've used. The interface is clean and the data is always reliable.",
            authorName: "Mike Rodriguez",
            authorTitle: "Product Manager",
            authorInitial: "M",
            avatarGradientFrom: "from-green-500",
            avatarGradientTo: "to-teal-600",
            rating: 5,
            aosDelay: "300",
            hoverBorderColor: "hover:border-purple-500/50",
        },
    ];

    // Platform integrations data
    const platforms = [
        { name: "Slack", textColorClass: "text-yellow-500" },
        { name: "Microsoft", textColorClass: "text-blue-500" },
        { name: "Google", textColorClass: "text-purple-500" },
        { name: "Salesforce", textColorClass: "text-orange-500" },
        { name: "Zapier", textColorClass: "text-pink-500" },
        { name: "+15 More", textColorClass: "text-green-500" },
    ];

    return (
        <section id="testimonials" className="py-20 bg-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <SectionHeading
                    title="What Our Users Say"
                    subtitle="Join thousands of professionals who trust our platform"
                    titleClassName="text-white"
                    subtitleClassName="text-gray-400"
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                    {testimonials.map((testimonial, index) => (
                        <TestimonialCard
                            key={index}
                            quote={testimonial.quote}
                            authorName={testimonial.authorName}
                            authorTitle={testimonial.authorTitle}
                            authorInitial={testimonial.authorInitial}
                            avatarGradientFrom={testimonial.avatarGradientFrom}
                            avatarGradientTo={testimonial.avatarGradientTo}
                            rating={testimonial.rating}
                            aosDelay={testimonial.aosDelay}
                            hoverBorderColor={testimonial.hoverBorderColor}
                        />
                    ))}
                </div>

                <div className="text-center" data-aos="fade-up">
                    <h3 className="text-2xl font-bold text-white mb-4">
                        Supported Integrations
                    </h3>
                    <p className="text-gray-400 mb-8">
                        Connect with 20+ popular platforms and services
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 max-w-4xl mx-auto">
                        {platforms.map((platform, index) => (
                            <ExchangeLogoItem
                                key={index}
                                name={platform.name}
                                textColorClass={platform.textColorClass}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default TestimonialsSection;
