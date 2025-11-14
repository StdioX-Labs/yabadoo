'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Script from 'next/script';

const EP_PRICE = 1500;

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
      <div className="min-h-screen bg-[#1A2421] text-[#F0FFF0]">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-[#1A2421]/90 border-b border-[#708238]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-[#708238]/20 rounded-full blur-md group-hover:bg-[#708238]/40 transition-all"></div>
                <Image
                  src="/images/logo/yaba_logo.png"
                  alt="Yaba Logo"
                  width={48}
                  height={48}
                  className="relative rounded-full ring-1 ring-[#708238]/30 group-hover:ring-[#708238]/60 transition-all"
                />
              </div>
              <div className="hidden sm:block">
                <div className="font-playfair text-xl font-bold text-[#F0FFF0] group-hover:text-[#708238] transition-colors">
                  YABA
                </div>
                <div className="text-[10px] text-[#708238]/70 uppercase tracking-widest">
                  Rhumba Artist
                </div>
              </div>
            </Link>

            <Link
              href="/"
              className="text-[#708238] hover:text-[#F0FFF0] transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-32 pb-20 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="font-playfair text-4xl md:text-5xl font-bold mb-4 text-gradient">
              Checkout
            </h1>
            <p className="text-[#F0FFF0]/60">Complete your purchase of WAPE WAPE EP</p>
          </div>

          <div className="grid lg:grid-cols-5 gap-8">
            {/* Order Summary */}
            <div className="lg:col-span-2">
              <div className="glass rounded-2xl p-6 border border-[#708238]/20 sticky top-32">
                <h2 className="font-playfair text-2xl font-bold mb-6">Order Summary</h2>

                <div className="flex gap-4 mb-6">
                  <div className="relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0">
                    <Image
                      src="/images/wape.PNG"
                      alt="WAPE WAPE EP"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg mb-1">WAPE WAPE EP</h3>
                    <p className="text-[#F0FFF0]/60 text-sm mb-2">Digital Album</p>
                    <p className="text-[#708238] text-sm">6 Tracks • 2025</p>
                  </div>
                </div>

                <div className="border-t border-[#708238]/20 pt-4 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#F0FFF0]/60">Subtotal</span>
                    <span>KES {EP_PRICE.toLocaleString()}</span>
                  </div>
                  <div className="border-t border-[#708238]/20 pt-3 flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span className="text-[#708238]">KES {EP_PRICE.toLocaleString()}</span>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-[#708238]/10 rounded-xl border border-[#708238]/30">
                  <p className="text-xs text-[#F0FFF0]/80">
                    ✓ Instant download after payment<br />
                    ✓ High-quality MP3 files<br />
                    ✓ Digital booklet included
                  </p>
                </div>
              </div>
            </div>

            {/* Payment Form */}
            <div className="lg:col-span-3">
              <div className="glass rounded-2xl p-6 md:p-8 border border-[#708238]/20">
                <h2 className="font-playfair text-2xl font-bold mb-6">Payment Details</h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Contact Information */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4 text-[#708238]">Contact Information</h3>
                    <div className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="firstName" className="block text-sm font-medium mb-2">
                            First Name *
                          </label>
                          <input
                            type="text"
                            id="firstName"
                            name="firstName"
                            required
                            value={formData.firstName}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 bg-[#1A2421] border border-[#708238]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#708238] focus:border-transparent text-[#F0FFF0] placeholder-[#F0FFF0]/40"
                            placeholder="John"
                          />
                        </div>
                        <div>
                          <label htmlFor="lastName" className="block text-sm font-medium mb-2">
                            Last Name *
                          </label>
                          <input
                            type="text"
                            id="lastName"
                            name="lastName"
                            required
                            value={formData.lastName}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 bg-[#1A2421] border border-[#708238]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#708238] focus:border-transparent text-[#F0FFF0] placeholder-[#F0FFF0]/40"
                            placeholder="Doe"
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="email" className="block text-sm font-medium mb-2">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-[#1A2421] border border-[#708238]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#708238] focus:border-transparent text-[#F0FFF0] placeholder-[#F0FFF0]/40"
                          placeholder="john@example.com"
                        />
                        <p className="text-xs text-[#F0FFF0]/50 mt-1">
                          Download link will be sent to this email
                        </p>
                      </div>

                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium mb-2">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          required
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-[#1A2421] border border-[#708238]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#708238] focus:border-transparent text-[#F0FFF0] placeholder-[#F0FFF0]/40"
                          placeholder="+254 712 345 678"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Payment Method Info */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4 text-[#708238]">Payment Method</h3>
                    
                    <div className="p-4 bg-[#708238]/10 rounded-xl border border-[#708238]/30">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#708238]/20 flex items-center justify-center">
                          <svg className="w-5 h-5 text-[#708238]" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/>
                          </svg>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-[#F0FFF0] mb-2">Secure Payment via Paystack</h4>
                          <p className="text-sm text-[#F0FFF0]/80 mb-2">
                            When you click &quot;Complete Payment&quot;, you&apos;ll be redirected to Paystack&apos;s secure checkout where you can pay with:
                          </p>
                          <ul className="text-sm text-[#F0FFF0]/70 space-y-1">
                            <li className="flex items-center gap-2">
                              <svg className="w-4 h-4 text-[#708238]" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                              </svg>
                              M-Pesa
                            </li>
                            <li className="flex items-center gap-2">
                              <svg className="w-4 h-4 text-[#708238]" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                              </svg>
                              Credit/Debit Card (Visa, Mastercard)
                            </li>
                            <li className="flex items-center gap-2">
                              <svg className="w-4 h-4 text-[#708238]" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                              </svg>
                              Bank Transfer
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full py-4 px-6 bg-[#708238] hover:bg-[#3F704D] text-[#F0FFF0] font-bold rounded-lg transition-all hover:shadow-lg hover:shadow-[#708238]/30 transform hover:scale-[1.02]"
                  >
                    Complete Payment • KES {EP_PRICE.toLocaleString()}
                  </button>

                  <p className="text-xs text-center text-[#F0FFF0]/50">
                    Secure payment powered by Paystack
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-[#708238]/10 py-8">
        <div className="max-w-6xl mx-auto px-4 text-center text-[#F0FFF0]/50 text-sm">
          <p>© 2025 YABA. All rights reserved.</p>
        </div>
      </footer>
    </div>
    </>
  );
}

