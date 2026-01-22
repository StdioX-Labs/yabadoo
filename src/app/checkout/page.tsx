'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Script from 'next/script';

const EP_PRICE = 1000;

const tracks = [
  { number: 1, title: "Adhiambo", duration: "3:42" },
  { number: 2, title: "Mazoea", duration: "4:15" },
  { number: 3, title: "Sema", duration: "3:28" },
  { number: 4, title: "Something Sweet", duration: "4:01" },
  { number: 5, title: "Today", duration: "3:55" },
  { number: 6, title: "Wape Wape", duration: "3:38" },
];

export default function CheckoutPage() {
  const [isPaystackLoaded, setIsPaystackLoaded] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isPaystackLoaded) {
      alert('Payment system is still loading. Please wait a moment.');
      return;
    }

    // @ts-ignore - PaystackPop is loaded from script
    const handler = window.PaystackPop.setup({
      key: 'pk_live_1edd5134d2a4bafe55af11d29e3184cbcbe49125',
      email: formData.email,
      amount: EP_PRICE * 100, // Amount in kobo (multiply by 100)
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
        alert('Payment cancelled. You can try again anytime!');
      },
      callback: function (response: any) {
        alert(
          'Payment successful! Reference: ' + response.reference +
          '\n\nYour download link will be sent to ' + formData.email
        );
        // Here you would typically verify the payment on your backend
        // and send the download link via email
      },
    });

    handler.openIframe();
  };

  return (
    <>
      <Script
        src="https://js.paystack.co/v1/inline.js"
        onLoad={() => setIsPaystackLoaded(true)}
        strategy="afterInteractive"
      />
      <div className="relative w-screen min-h-screen overflow-auto bg-black">
        {/* Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[#1A2421]"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60"></div>
        </div>

        {/* Top Left - YABA Logo */}
        <div className="fixed top-4 md:top-8 left-6 md:left-12 lg:left-16 z-50">
          <Link href="/">
            <Image
              src="/images/logo/yaba_logo.png"
              alt="Yaba Logo"
              width={64}
              height={64}
              className="rounded-full w-16 h-16 md:w-24 md:h-24 hover:opacity-80 transition-opacity"
            />
          </Link>
        </div>

        {/* Top Right - YABA */}
        <div className="fixed top-6 md:top-8 right-6 md:right-12 lg:right-16 z-50">
          <h2 className="text-[#F0FFF0] font-playfair text-2xl md:text-3xl font-bold tracking-[0.2em]" style={{ writingMode: "vertical-rl" }}>
            YABA
          </h2>
        </div>

        {/* Main Content */}
        <div className="relative z-10 pt-32 pb-20 px-4 md:px-8">
          <div className="max-w-5xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12 md:mb-16">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-[#F0FFF0]/60 hover:text-[#708238] transition-colors mb-8 font-playfair text-sm tracking-[0.2em] uppercase"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back
              </Link>
              <h1 className="font-playfair text-4xl md:text-6xl font-bold mb-4 text-[#F0FFF0] tracking-tight">
                WAPE WAPE
              </h1>
              <p className="text-[#F0FFF0]/60 font-playfair text-sm tracking-[0.2em] uppercase">
                Digital Album • 2025
              </p>
            </div>

            {/* EP Preview & Checkout Form */}
            <div className="grid md:grid-cols-2 gap-8 md:gap-12">
              {/* Left: EP Preview */}
              <div className="space-y-6">
                {/* Album Art */}
                <div className="relative aspect-square w-full max-w-md mx-auto">
                  <Image
                    src="/images/wape.PNG"
                    alt="WAPE WAPE EP"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>

                {/* Track List */}
                <div className="border border-[#708238]/30 p-6">
                  <h3 className="font-playfair text-lg md:text-xl font-bold mb-4 text-[#708238] tracking-[0.15em] uppercase">
                    Tracklist
                  </h3>
                  <div className="space-y-3">
                    {tracks.map((track) => (
                      <div
                        key={track.number}
                        className="flex items-center justify-between text-sm border-b border-[#708238]/10 pb-2 last:border-0 last:pb-0"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-[#708238] font-playfair font-bold w-6">
                            {String(track.number).padStart(2, '0')}
                          </span>
                          <span className="text-[#F0FFF0] font-playfair">
                            {track.title}
                          </span>
                        </div>
                        <span className="text-[#F0FFF0]/50 font-playfair text-xs">
                          {track.duration}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Features */}
                <div className="border border-[#708238]/30 p-6">
                  <div className="space-y-2 text-sm text-[#F0FFF0]/70">
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-[#708238]" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                      </svg>
                      <span className="font-playfair">High-quality MP3 files</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-[#708238]" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                      </svg>
                      <span className="font-playfair">Instant download</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-[#708238]" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                      </svg>
                      <span className="font-playfair">Digital booklet included</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: Checkout Form */}
              <div>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Price */}
                  <div className="border border-[#708238]/30 p-6 text-center">
                    <p className="text-[#F0FFF0]/60 font-playfair text-sm tracking-[0.15em] uppercase mb-2">
                      Price
                    </p>
                    <p className="text-4xl md:text-5xl font-bold text-[#708238] font-playfair">
                      KES {EP_PRICE.toLocaleString()}
                    </p>
                  </div>

                  {/* Contact Information */}
                  <div className="space-y-4">
                    <h3 className="font-playfair text-lg font-bold text-[#708238] tracking-[0.15em] uppercase">
                      Your Details
                    </h3>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="firstName" className="block text-xs font-playfair text-[#F0FFF0]/60 mb-2 tracking-[0.1em] uppercase">
                          First Name
                        </label>
                        <input
                          type="text"
                          id="firstName"
                          name="firstName"
                          required
                          value={formData.firstName}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-transparent border border-[#708238]/30 focus:border-[#708238] text-[#F0FFF0] placeholder-[#F0FFF0]/30 font-playfair transition-colors outline-none"
                          placeholder="John"
                        />
                      </div>
                      <div>
                        <label htmlFor="lastName" className="block text-xs font-playfair text-[#F0FFF0]/60 mb-2 tracking-[0.1em] uppercase">
                          Last Name
                        </label>
                        <input
                          type="text"
                          id="lastName"
                          name="lastName"
                          required
                          value={formData.lastName}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-transparent border border-[#708238]/30 focus:border-[#708238] text-[#F0FFF0] placeholder-[#F0FFF0]/30 font-playfair transition-colors outline-none"
                          placeholder="Doe"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-xs font-playfair text-[#F0FFF0]/60 mb-2 tracking-[0.1em] uppercase">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-transparent border border-[#708238]/30 focus:border-[#708238] text-[#F0FFF0] placeholder-[#F0FFF0]/30 font-playfair transition-colors outline-none"
                        placeholder="john@example.com"
                      />
                      <p className="text-xs text-[#F0FFF0]/40 mt-1 font-playfair">
                        Download link will be sent here
                      </p>
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-xs font-playfair text-[#F0FFF0]/60 mb-2 tracking-[0.1em] uppercase">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-transparent border border-[#708238]/30 focus:border-[#708238] text-[#F0FFF0] placeholder-[#F0FFF0]/30 font-playfair transition-colors outline-none"
                        placeholder="+254 712 345 678"
                      />
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div className="border border-[#708238]/30 p-4">
                    <p className="text-xs text-[#F0FFF0]/60 font-playfair tracking-[0.1em] uppercase mb-2">
                      Payment via Paystack
                    </p>
                    <p className="text-xs text-[#F0FFF0]/50 font-playfair">
                      M-Pesa • Card • Bank Transfer
                    </p>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full py-4 border-2 border-[#F0FFF0] text-[#F0FFF0] font-playfair text-sm tracking-[0.2em] uppercase hover:bg-[#F0FFF0] hover:text-black transition-all duration-300"
                  >
                    Complete Payment
                  </button>

                  <p className="text-xs text-center text-[#F0FFF0]/40 font-playfair">
                    Secure payment powered by Paystack
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright Notice - Bottom */}
        <div className="relative z-10 pb-8 text-center text-[#F0FFF0]/50 text-xs font-playfair">
          Powered by{" "}
          <a
            href="https://soldoutafrica.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#708238] transition-colors underline"
          >
            SoldOutAfrica
          </a>
        </div>
      </div>
    </>
  );
}

