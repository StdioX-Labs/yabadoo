'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Script from 'next/script';

const PRESET_AMOUNTS = [100, 200, 500, 1000, 2000];

export default function CoffeePage() {
  const [isPaystackLoaded, setIsPaystackLoaded] = useState(false);
  const [customAmount, setCustomAmount] = useState('');
  const [selectedPreset, setSelectedPreset] = useState<number | null>(500);
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    message: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePresetClick = (amount: number) => {
    setSelectedPreset(amount);
    setCustomAmount('');
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ''); // Only numbers
    setCustomAmount(value);
    setSelectedPreset(null);
  };

  const getAmount = (): number => {
    if (customAmount) return parseInt(customAmount);
    return selectedPreset || 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = getAmount();
    if (amount < 50) {
      alert('Minimum amount is KES 50');
      return;
    }

    if (!isPaystackLoaded) {
      alert('Payment system is still loading. Please wait a moment.');
      return;
    }

    // @ts-ignore - PaystackPop is loaded from script
    const handler = window.PaystackPop.setup({
      key: 'pk_live_1edd5134d2a4bafe55af11d29e3184cbcbe49125',
      email: formData.email,
      amount: amount * 100, // Amount in kobo (multiply by 100)
      currency: 'KES',
      ref: 'COFFEE_' + Math.floor(Math.random() * 1000000000 + 1),
      metadata: {
        custom_fields: [
          {
            display_name: 'Customer Name',
            variable_name: 'customer_name',
            value: `${formData.firstName} ${formData.lastName}`,
          },
          {
            display_name: 'Message',
            variable_name: 'message',
            value: formData.message || 'No message',
          },
          {
            display_name: 'Product',
            variable_name: 'product',
            value: 'Buy Yaba a Coffee',
          },
        ],
      },
      onClose: function () {
        alert('Payment cancelled. You can try again anytime!');
      },
      callback: function (response: any) {
        alert(
          `Thank you for supporting Yaba! ☕\n\nPayment successful!\nReference: ${response.reference}\nAmount: KES ${amount.toLocaleString()}`
        );
        // Here you would typically verify the payment on your backend
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
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-[#708238] to-[#3F704D] mb-6 shadow-2xl shadow-[#708238]/50">
              <svg className="w-10 h-10 sm:w-12 sm:h-12 text-[#F0FFF0]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M2 21h18v-2H2v2zM20 8h-2V5h2c1.1 0 2 .9 2 2v1c0 1.1-.9 2-2 2zm-2 10H4V5h14v13zm-9-9h6v6h-6V9z"/>
              </svg>
            </div>
            <h1 className="font-playfair text-4xl sm:text-5xl md:text-6xl font-bold mb-4 text-gradient">
              Buy Yaba a Coffee
            </h1>
            <p className="text-base sm:text-lg text-[#F0FFF0]/60 max-w-2xl mx-auto">
              Support Yaba&apos;s music journey! Your contribution helps create more authentic Kenyan Rhumba.
            </p>
          </div>

          <div className="glass rounded-3xl border border-[#708238]/20 overflow-hidden">
            {/* Amount Selection */}
            <div className="p-6 sm:p-8 border-b border-[#708238]/20 bg-[#708238]/5">
              <h2 className="font-playfair text-2xl sm:text-3xl font-bold mb-2 text-center">Choose Your Amount</h2>
              <p className="text-sm text-[#F0FFF0]/60 text-center mb-6">Every cup of coffee makes a difference ☕</p>

              {/* Preset Amounts */}
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 sm:gap-4 mb-6">
                {PRESET_AMOUNTS.map((amount) => (
                  <button
                    key={amount}
                    onClick={() => handlePresetClick(amount)}
                    className={`relative py-4 sm:py-5 px-3 sm:px-4 rounded-xl sm:rounded-2xl font-bold text-base sm:text-lg transition-all transform active:scale-95 sm:hover:scale-105 ${
                      selectedPreset === amount
                        ? 'bg-gradient-to-br from-[#708238] to-[#3F704D] text-[#F0FFF0] shadow-lg shadow-[#708238]/40'
                        : 'bg-[#1A2421] border-2 border-[#708238]/30 text-[#F0FFF0]/80 hover:border-[#708238]'
                    }`}
                  >
                    <div className="text-xs sm:text-sm opacity-75 mb-1">KES</div>
                    <div>{amount.toLocaleString()}</div>
                  </button>
                ))}
              </div>

              {/* Custom Amount */}
              <div className="relative">
                <label className="block text-sm font-semibold mb-2 text-[#708238]">
                  Or Enter Custom Amount
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#708238] font-bold text-lg">
                    KES
                  </div>
                  <input
                    type="text"
                    value={customAmount}
                    onChange={handleCustomAmountChange}
                    className="w-full pl-16 pr-4 py-4 bg-[#1A2421] border-2 border-[#708238]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#708238] focus:border-transparent text-[#F0FFF0] text-lg font-bold placeholder-[#F0FFF0]/30"
                    placeholder="Enter amount (min. 50)"
                  />
                </div>
                <p className="text-xs text-[#F0FFF0]/50 mt-2">Minimum amount: KES 50</p>
              </div>

              {/* Total Display */}
              <div className="mt-6 p-4 bg-gradient-to-r from-[#708238]/20 to-[#3F704D]/20 rounded-xl border border-[#708238]/40">
                <div className="flex items-center justify-between">
                  <span className="text-[#F0FFF0]/80">You&apos;re sending:</span>
                  <span className="text-3xl sm:text-4xl font-bold text-[#708238]">
                    KES {getAmount().toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Payment Form */}
            <div className="p-6 sm:p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Contact Information */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-[#708238]">Your Information</h3>
                  <div className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
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
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium mb-2">
                        Leave a Message (Optional)
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        rows={3}
                        value={formData.message}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-[#1A2421] border border-[#708238]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#708238] focus:border-transparent text-[#F0FFF0] placeholder-[#F0FFF0]/40 resize-none"
                        placeholder="Say something nice to Yaba..."
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
                          When you click &quot;Send Coffee&quot;, you&apos;ll be redirected to Paystack&apos;s secure checkout where you can pay with:
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
                  disabled={getAmount() < 50}
                  className="w-full py-4 px-6 bg-gradient-to-r from-[#708238] to-[#3F704D] hover:from-[#3F704D] hover:to-[#708238] disabled:from-[#708238]/50 disabled:to-[#3F704D]/50 disabled:cursor-not-allowed text-[#F0FFF0] font-bold rounded-xl transition-all transform active:scale-95 sm:hover:scale-[1.02] shadow-xl shadow-[#708238]/30 flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M2 21h18v-2H2v2zM20 8h-2V5h2c1.1 0 2 .9 2 2v1c0 1.1-.9 2-2 2zm-2 10H4V5h14v13zm-9-9h6v6h-6V9z"/>
                  </svg>
                  Send Coffee • KES {getAmount().toLocaleString()}
                </button>

                <p className="text-xs text-center text-[#F0FFF0]/50">
                  Secure payment powered by Paystack
                </p>
              </form>
            </div>
          </div>

          {/* Info Section */}
          <div className="mt-8 grid sm:grid-cols-3 gap-4">
            <div className="glass rounded-xl p-5 border border-[#708238]/20 text-center">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-br from-[#708238] to-[#3F704D] flex items-center justify-center">
                <svg className="w-6 h-6 text-[#F0FFF0]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
              <h4 className="font-semibold text-[#F0FFF0] mb-1">Secure Payment</h4>
              <p className="text-xs text-[#F0FFF0]/60">Encrypted & safe</p>
            </div>
            <div className="glass rounded-xl p-5 border border-[#708238]/20 text-center">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-br from-[#708238] to-[#3F704D] flex items-center justify-center">
                <svg className="w-6 h-6 text-[#F0FFF0]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
              </div>
              <h4 className="font-semibold text-[#F0FFF0] mb-1">Direct Support</h4>
              <p className="text-xs text-[#F0FFF0]/60">100% to Yaba</p>
            </div>
            <div className="glass rounded-xl p-5 border border-[#708238]/20 text-center">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-br from-[#708238] to-[#3F704D] flex items-center justify-center">
                <svg className="w-6 h-6 text-[#F0FFF0]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z"/>
                </svg>
              </div>
              <h4 className="font-semibold text-[#F0FFF0] mb-1">More Music</h4>
              <p className="text-xs text-[#F0FFF0]/60">Fund new tracks</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-[#708238]/10 py-8">
        <div className="max-w-4xl mx-auto px-4 text-center text-[#F0FFF0]/50 text-sm">
          <p>© 2025 YABA. All rights reserved.</p>
        </div>
      </footer>
    </div>
    </>
  );
}
