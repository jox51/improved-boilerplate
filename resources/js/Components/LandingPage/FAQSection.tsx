import React, { useState } from "react";
import SectionHeading from "./Shared/SectionHeading";

interface FAQItem {
    question: string;
    answer: string;
    isOpen?: boolean;
}

const FAQSection: React.FC = () => {
    const [openFAQ, setOpenFAQ] = useState<number | null>(null);

    const faqs: FAQItem[] = [
        {
            question: "What is this platform and how does it help my business?",
            answer: "Our platform is a comprehensive solution that helps businesses streamline their operations through advanced analytics, automation, and real-time monitoring. It provides insights and tools to optimize your workflow, increase productivity, and make data-driven decisions.",
        },
        {
            question:
                "How quickly can I see results after implementing the platform?",
            answer: "Most users start seeing improvements within the first week of implementation. Our AI-powered system begins analyzing your data immediately, and you'll receive actionable insights and automated workflows that can boost efficiency from day one.",
        },
        {
            question: "What types of integrations does the platform support?",
            answer: "Our platform supports integrations with 20+ popular business tools including CRM systems, project management tools, communication platforms, and analytics services. We offer both pre-built integrations and custom API connections to fit your specific needs.",
        },
        {
            question: "Do I need technical expertise to use this platform?",
            answer: "Not at all! Our platform is designed to be user-friendly for professionals of all technical levels. We provide intuitive dashboards, step-by-step guides, and comprehensive onboarding to help you get started quickly and effectively.",
        },
        {
            question: "What kind of support and training do you provide?",
            answer: "We offer comprehensive support including 24/7 customer service, detailed documentation, video tutorials, and personalized onboarding sessions. Our team is always available to help you maximize the value of our platform.",
        },
        {
            question:
                "How much can I expect to save or improve with this platform?",
            answer: "Results vary based on your current processes and implementation, but our users typically see 20-40% improvements in efficiency, significant time savings on manual tasks, and better decision-making through data insights. ROI is usually realized within the first few months.",
        },
        {
            question: "Is my data secure and what about privacy?",
            answer: "Yes, security and privacy are our top priorities. We use enterprise-grade encryption, comply with industry standards like GDPR and SOC 2, and implement strict access controls. Your data is always protected and never shared with third parties.",
        },
    ];

    const toggleFAQ = (index: number) => {
        setOpenFAQ(openFAQ === index ? null : index);
    };

    return (
        <section id="faq" className="py-20 bg-gray-900">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <SectionHeading
                    title={
                        <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                            Frequently Asked Questions
                        </span>
                    }
                    subtitle="Everything you need to know about our platform and how it can help your business"
                    subtitleClassName="text-gray-400"
                />

                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl overflow-hidden transition-all duration-300 hover:border-blue-500/30"
                            data-aos="fade-up"
                            data-aos-delay={`${(index + 1) * 100}`}
                        >
                            <button
                                onClick={() => toggleFAQ(index)}
                                className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-gray-700/30 transition-colors duration-200"
                                aria-expanded={openFAQ === index}
                            >
                                <h3 className="text-lg font-semibold text-white pr-4">
                                    {faq.question}
                                </h3>
                                <div className="flex-shrink-0">
                                    <div
                                        className={`w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center transition-transform duration-300 ${
                                            openFAQ === index
                                                ? "rotate-180"
                                                : ""
                                        }`}
                                    >
                                        <svg
                                            className="w-3 h-3 text-white"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M19 9l-7 7-7-7"
                                            />
                                        </svg>
                                    </div>
                                </div>
                            </button>

                            <div
                                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                                    openFAQ === index
                                        ? "max-h-96 opacity-100"
                                        : "max-h-0 opacity-0"
                                }`}
                            >
                                <div className="px-6 pb-5">
                                    <div className="h-px bg-gradient-to-r from-blue-500/20 to-purple-500/20 mb-4"></div>
                                    <p className="text-gray-300 leading-relaxed">
                                        {faq.answer}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Call to Action */}
                <div
                    className="mt-12 text-center"
                    data-aos="fade-up"
                    data-aos-delay="800"
                >
                    <div className="bg-gradient-to-r from-indigo-900/50 to-purple-900/50 backdrop-blur-sm border border-indigo-500/30 rounded-xl p-8">
                        <h3 className="text-2xl font-bold text-white mb-4">
                            Still have questions?
                        </h3>
                        <p className="text-gray-300 mb-6">
                            Our support team is here to help you get started and
                            make the most of our platform.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <a
                                href="/contact"
                                className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105"
                            >
                                <span className="mr-2">💬</span>
                                Contact Support
                            </a>
                            <a
                                href="#pricing"
                                className="inline-flex items-center justify-center px-6 py-3 bg-transparent border-2 border-blue-500/50 hover:border-blue-400 text-blue-400 hover:text-blue-300 font-semibold rounded-lg transition-all duration-300"
                            >
                                <span className="mr-2">🚀</span>
                                Start Free Trial
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FAQSection;
