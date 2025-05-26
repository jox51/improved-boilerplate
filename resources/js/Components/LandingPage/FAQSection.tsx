import React, { useState } from 'react';
import SectionHeading from './Shared/SectionHeading';

interface FAQItem {
    question: string;
    answer: string;
    isOpen?: boolean;
}

const FAQSection: React.FC = () => {
    const [openFAQ, setOpenFAQ] = useState<number | null>(null);

    const faqs: FAQItem[] = [
        {
            question: "What is cryptocurrency arbitrage and how does Arbscreener help?",
            answer: "Cryptocurrency arbitrage involves buying a digital asset on one exchange and selling it on another to profit from price differences. Arbscreener automatically scans 150+ exchanges in real-time to identify these profitable opportunities across spot markets, futures, and DEX platforms, saving you hours of manual research."
        },
        {
            question: "How quickly does Arbscreener detect arbitrage opportunities?",
            answer: "Our AI-powered system scans markets in real-time, typically detecting arbitrage opportunities within seconds of them appearing. You'll receive instant notifications via email, Telegram, or in-app alerts, ensuring you never miss a profitable trade."
        },
        {
            question: "What types of arbitrage does Arbscreener support?",
            answer: "Arbscreener supports three main types of arbitrage: Spot-to-Spot (price differences across centralized exchanges), Futures Arbitrage (differences between spot and futures markets), and DEX-to-DEX Arbitrage (opportunities within and between decentralized exchanges)."
        },
        {
            question: "Do I need trading experience to use Arbscreener?",
            answer: "While basic understanding of cryptocurrency trading is helpful, Arbscreener is designed to be user-friendly for traders of all levels. Our platform provides clear profit calculations, step-by-step trade instructions, and risk assessments to help you make informed decisions."
        },
        {
            question: "What exchanges and blockchains does Arbscreener monitor?",
            answer: "We monitor 150+ exchanges including major CEXs like Binance, Coinbase, Kraken, and popular DEXs across multiple blockchains including Ethereum, BSC, Polygon, Arbitrum, and more. Our coverage is constantly expanding to include new exchanges and chains."
        },
        {
            question: "How much profit can I expect from arbitrage trading?",
            answer: "Profit potential varies based on market conditions, trade size, and execution speed. Our users typically find opportunities ranging from 0.5% to 5% profit margins, with some exceptional cases reaching higher percentages. Remember that profits depend on your capital, trading fees, and market timing."
        },
        {
            question: "Are there any risks involved in arbitrage trading?",
            answer: "Yes, arbitrage trading involves risks including price slippage, network congestion, exchange downtime, and withdrawal delays. Arbscreener helps minimize these risks by providing real-time market data, liquidity analysis, and risk assessments for each opportunity."
        }
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
                    subtitle="Everything you need to know about cryptocurrency arbitrage and Arbscreener"
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
                                            openFAQ === index ? 'rotate-180' : ''
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
                                        ? 'max-h-96 opacity-100' 
                                        : 'max-h-0 opacity-0'
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
                <div className="mt-12 text-center" data-aos="fade-up" data-aos-delay="800">
                    <div className="bg-gradient-to-r from-indigo-900/50 to-purple-900/50 backdrop-blur-sm border border-indigo-500/30 rounded-xl p-8">
                        <h3 className="text-2xl font-bold text-white mb-4">
                            Still have questions?
                        </h3>
                        <p className="text-gray-300 mb-6">
                            Our support team is here to help you get started with cryptocurrency arbitrage trading.
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