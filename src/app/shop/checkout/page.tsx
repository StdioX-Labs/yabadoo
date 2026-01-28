'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Script from 'next/script';

const EP_PRICE = 1000;
const EP_DATA = {
    title: 'WAPE WAPE',
    artist: 'YABA',
    trackCount: 6,
};

const tracks = [
    'Adhiambo',
    'Mazoea',
    'Sema',
    'Something Sweet',
    'Today',
    'Wape Wape',
];

export default function ShopCheckoutPage() {
    const [isPaystackLoaded, setIsPaystackLoaded] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        firstName: '',
        lastName: '',
        phone: '',
    });

    // Check if Paystack script is loaded
    useEffect(() => {
        const checkPaystackLoaded = () => {
            // @ts-ignore
            if (typeof window !== 'undefined' && window.PaystackPop) {
                setIsPaystackLoaded(true);
                console.log('✅ Paystack loaded successfully');
            }
        };

        // Check immediately
        checkPaystackLoaded();

        // Check again after a short delay
        const timer = setTimeout(checkPaystackLoaded, 1000);

        return () => clearTimeout(timer);
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Check if Paystack is available
        // @ts-ignore
        if (typeof window === 'undefined' || !window.PaystackPop) {
            console.error('❌ Paystack not loaded');
            alert('Payment system is still loading. Please wait a moment and try again.');
            return;
        }

        setIsProcessing(true);

        console.log('🔄 Initiating Paystack payment');

        // @ts-ignore - PaystackPop is loaded from external script
        const handler = window.PaystackPop.setup({
            key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || 'pk_live_1edd5134d2a4bafe55af11d29e3184cbcbe49125',
            email: formData.email,
            amount: EP_PRICE * 100, // Amount in kobo
            currency: 'KES',
            ref: 'WAPE_EP_' + Math.floor(Math.random() * 1000000000 + 1),
            metadata: {
                custom_fields: [
                    {
                        display_name: 'Customer Name',
                        variable_name: 'customer_name',
                        value: `${formData.firstName} ${formData.lastName}`,
                    },
                    {
                        display_name: 'Phone Number',
                        variable_name: 'phone_number',
                        value: formData.phone,
                    },
                    {
                        display_name: 'Product',
                        variable_name: 'product',
                        value: 'WAPE WAPE EP - Digital Album',
                    },
                ],
            },
            onClose: function () {
                console.log('❌ Payment cancelled');
                setIsProcessing(false);
                alert('Payment cancelled. You can try again anytime!');
            },
            callback: function (response: { reference: string }) {
                console.log('✅ Payment successful:', response.reference);
                setIsProcessing(false);
                alert(
                    'Payment successful! Reference: ' + response.reference +
                    '\n\nYour download link will be sent to ' + formData.email
                );
            },
        });

        console.log('✅ Opening Paystack popup');
        handler.openIframe();
    };

    return (
        <>
            <Script
                src="https://js.paystack.co/v1/inline.js"
                onLoad={() => {
                    setIsPaystackLoaded(true);
                    console.log('✅ Paystack script loaded via onLoad');
                }}
                onError={(e) => {
                    console.error('❌ Failed to load Paystack script:', e);
                }}
                strategy="lazyOnload"
            />
            <div className="relative w-screen min-h-screen overflow-auto bg-black">
                {/* Background */}
                <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-[#1A2421]"></div>
                    <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60"></div>
                </div>

                {/* Top Left - YABA Logo */}
                <div className="fixed top-4 md:top-8 left-6 md:left-12 lg:left-16 z-50">
                    <Link href="/shop">
                        <Image
                            src="/images/logo/yaba_logo.png"
                            alt="YABA"
                            width={40}
                            height={40}
                            className="rounded-full hover:opacity-80 transition-opacity"
                        />
                    </Link>
                </div>

                {/* Main Content */}
                <div className="relative z-10 flex items-center justify-center min-h-screen p-4 md:p-8">
                    <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 lg:gap-12">
                        {/* Left: Album Info */}
                        <div className="flex flex-col justify-center text-white">
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
                                {EP_DATA.title}
                            </h1>
                            <p className="text-xl md:text-2xl text-white/80 mb-8">
                                by {EP_DATA.artist}
                            </p>

                            <div className="mb-8">
                                <h3 className="text-lg font-semibold mb-4">TRACKLIST</h3>
                                <div className="space-y-2">
                                    {tracks.map((track, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center justify-between py-2 px-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                                        >
                                            <div className="flex items-center gap-4">
                                                <span className="text-white/50 w-6">{index + 1}</span>
                                                <span>{track}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="text-3xl md:text-4xl font-bold">
                                KES {EP_PRICE.toLocaleString()}
                            </div>
                        </div>

                        {/* Right: Checkout Form */}
                        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 md:p-8">
                            <h2 className="text-2xl font-bold text-white mb-6">
                                Complete Your Purchase
                            </h2>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-white/80 mb-2">
                                        Email Address
                                    </label>
                                    <input
                                        id="email"
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-white/40 transition-colors"
                                        placeholder="your@email.com"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="firstName" className="block text-sm font-medium text-white/80 mb-2">
                                            First Name
                                        </label>
                                        <input
                                            id="firstName"
                                            type="text"
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-white/40 transition-colors"
                                            placeholder="John"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="lastName" className="block text-sm font-medium text-white/80 mb-2">
                                            Last Name
                                        </label>
                                        <input
                                            id="lastName"
                                            type="text"
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-white/40 transition-colors"
                                            placeholder="Doe"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="phone" className="block text-sm font-medium text-white/80 mb-2">
                                        Phone Number
                                    </label>
                                    <input
                                        id="phone"
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-white/40 transition-colors"
                                        placeholder="+254 7XX XXX XXX"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={isProcessing}
                                    className="w-full py-4 bg-white text-black font-bold rounded-lg hover:bg-white/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isProcessing ? 'Processing...' : `Pay KES ${EP_PRICE.toLocaleString()}`}
                                </button>

                                <p className="text-xs text-white/50 text-center">
                                    Secure payment powered by Paystack
                                </p>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Bottom Right - Credits */}
                <div className="fixed bottom-4 md:bottom-8 right-6 md:right-12 lg:right-16 z-50 text-white/50 text-sm">
                    <a
                        href="https://soldoutafrica.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-white transition-colors"
                    >
                        SoldOutAfrica
                    </a>
                </div>
            </div>
        </>
    );
}
