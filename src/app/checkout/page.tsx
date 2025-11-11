'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

type CheckoutTab = 'mpesa' | 'card';

export default function CheckoutPage() {
  const [activeTab, setActiveTab] = useState<CheckoutTab>('mpesa');
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    mpesaNumber: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle checkout logic here
    console.log('Checkout submitted:', { ...formData, paymentMethod: activeTab });
    alert(`Processing ${activeTab.toUpperCase()} payment...`);
  };

  return (
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
                    <span>KES 1,000</span>
                  </div>
                  <div className="border-t border-[#708238]/20 pt-3 flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span className="text-[#708238]">KES 1,000</span>
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

                  {/* Payment Method Tabs */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4 text-[#708238]">Payment Method</h3>

                    {/* Tab Buttons */}
                    <div className="flex gap-2 mb-6">
                      <button
                        type="button"
                        onClick={() => setActiveTab('mpesa')}
                        className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                          activeTab === 'mpesa'
                            ? 'bg-[#708238] text-[#F0FFF0] shadow-lg shadow-[#708238]/30'
                            : 'bg-[#1A2421] text-[#F0FFF0]/60 border border-[#708238]/30 hover:border-[#708238]'
                        }`}
                      >
                        <div className="flex items-center justify-center gap-2">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.31-8.86c-1.77-.45-2.34-.94-2.34-1.67 0-.84.79-1.43 2.1-1.43 1.38 0 1.9.66 1.94 1.64h1.71c-.05-1.34-.87-2.57-2.49-2.97V5H10.9v1.69c-1.51.32-2.72 1.3-2.72 2.81 0 1.79 1.49 2.69 3.66 3.21 1.95.46 2.34 1.15 2.34 1.87 0 .53-.39 1.39-2.1 1.39-1.6 0-2.23-.72-2.32-1.64H8.04c.1 1.7 1.36 2.66 2.86 2.97V19h2.34v-1.67c1.52-.29 2.72-1.16 2.73-2.77-.01-2.2-1.9-2.96-3.66-3.42z"/>
                          </svg>
                          M-Pesa
                        </div>
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveTab('card')}
                        className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                          activeTab === 'card'
                            ? 'bg-[#708238] text-[#F0FFF0] shadow-lg shadow-[#708238]/30'
                            : 'bg-[#1A2421] text-[#F0FFF0]/60 border border-[#708238]/30 hover:border-[#708238]'
                        }`}
                      >
                        <div className="flex items-center justify-center gap-2">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/>
                          </svg>
                          Card
                        </div>
                      </button>
                    </div>

                    {/* M-Pesa Form */}
                    {activeTab === 'mpesa' && (
                      <div className="space-y-4 animate-fadeIn">
                        <div className="p-4 bg-[#708238]/10 rounded-xl border border-[#708238]/30 mb-4">
                          <p className="text-sm text-[#F0FFF0]/80">
                            <strong>How it works:</strong><br />
                            1. Enter your M-Pesa number below<br />
                            2. Click &quot;Complete Payment&quot;<br />
                            3. You&apos;ll receive an STK push on your phone<br />
                            4. Enter your M-Pesa PIN to complete payment
                          </p>
                        </div>

                        <div>
                          <label htmlFor="mpesaNumber" className="block text-sm font-medium mb-2">
                            M-Pesa Phone Number *
                          </label>
                          <input
                            type="tel"
                            id="mpesaNumber"
                            name="mpesaNumber"
                            required={activeTab === 'mpesa'}
                            value={formData.mpesaNumber}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 bg-[#1A2421] border border-[#708238]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#708238] focus:border-transparent text-[#F0FFF0] placeholder-[#F0FFF0]/40"
                            placeholder="254712345678"
                          />
                          <p className="text-xs text-[#F0FFF0]/50 mt-1">
                            Enter number in format: 254XXXXXXXXX
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Card Form */}
                    {activeTab === 'card' && (
                      <div className="space-y-4 animate-fadeIn">
                        <div className="p-4 bg-[#708238]/10 rounded-xl border border-[#708238]/30 mb-4">
                          <div className="flex items-center gap-2 text-sm text-[#F0FFF0]/80">
                            <svg className="w-5 h-5 text-[#708238]" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/>
                            </svg>
                            Your payment information is secure and encrypted
                          </div>
                        </div>

                        <div>
                          <label htmlFor="cardNumber" className="block text-sm font-medium mb-2">
                            Card Number *
                          </label>
                          <input
                            type="text"
                            id="cardNumber"
                            name="cardNumber"
                            required={activeTab === 'card'}
                            value={formData.cardNumber}
                            onChange={handleInputChange}
                            maxLength={19}
                            className="w-full px-4 py-3 bg-[#1A2421] border border-[#708238]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#708238] focus:border-transparent text-[#F0FFF0] placeholder-[#F0FFF0]/40"
                            placeholder="1234 5678 9012 3456"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="expiryDate" className="block text-sm font-medium mb-2">
                              Expiry Date *
                            </label>
                            <input
                              type="text"
                              id="expiryDate"
                              name="expiryDate"
                              required={activeTab === 'card'}
                              value={formData.expiryDate}
                              onChange={handleInputChange}
                              maxLength={5}
                              className="w-full px-4 py-3 bg-[#1A2421] border border-[#708238]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#708238] focus:border-transparent text-[#F0FFF0] placeholder-[#F0FFF0]/40"
                              placeholder="MM/YY"
                            />
                          </div>
                          <div>
                            <label htmlFor="cvv" className="block text-sm font-medium mb-2">
                              CVV *
                            </label>
                            <input
                              type="text"
                              id="cvv"
                              name="cvv"
                              required={activeTab === 'card'}
                              value={formData.cvv}
                              onChange={handleInputChange}
                              maxLength={4}
                              className="w-full px-4 py-3 bg-[#1A2421] border border-[#708238]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#708238] focus:border-transparent text-[#F0FFF0] placeholder-[#F0FFF0]/40"
                              placeholder="123"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full py-4 px-6 bg-[#708238] hover:bg-[#3F704D] text-[#F0FFF0] font-bold rounded-lg transition-all hover:shadow-lg hover:shadow-[#708238]/30 transform hover:scale-[1.02]"
                  >
                    Complete Payment • KES 1,050
                  </button>

                  <p className="text-xs text-center text-[#F0FFF0]/50">
                    Complete Payment • KES 1,000
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
  );
}

