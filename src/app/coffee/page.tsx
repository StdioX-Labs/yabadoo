'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Script from 'next/script';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Coffee, Heart, Music, Shield, Check } from 'lucide-react';

const PRESET_AMOUNTS = [100, 200, 500, 1000, 2000];

export default function CoffeePage() {
  const [scrollY, setScrollY] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const headerRef = useRef<HTMLElement>(null);
  const [isPaystackLoaded, setIsPaystackLoaded] = useState(false);
  const [customAmount, setCustomAmount] = useState('');
  const [selectedPreset, setSelectedPreset] = useState<number | null>(500);
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    message: '',
  });

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;

      setScrollY(scrollTop);
      setScrollProgress(scrollPercent);

      if (headerRef.current) {
        const scrollRatio = Math.min(window.scrollY / 200, 1);
        headerRef.current.style.backgroundColor = `rgba(10, 15, 13, ${scrollRatio * 0.95})`;
        headerRef.current.style.backdropFilter = `blur(${scrollRatio * 20}px)`;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
            value: 'Buy Me Coffee',
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
      <div className="relative bg-[#0A0F0D] text-[#F0FFF0] min-h-screen">
        {/* Scroll Progress Bar */}
        <div className="fixed top-0 left-0 right-0 h-1 bg-[#1A2421] z-[100]">
          <div
            className="h-full bg-gradient-to-r from-[#708238] to-[#F0FFF0] transition-all duration-300"
            style={{ width: `${scrollProgress}%` }}
          />
        </div>

        {/* Fixed Header */}
        <header
          ref={headerRef}
          className="fixed top-0 left-0 right-0 z-50 transition-all duration-500 border-b border-white/10 py-3"
          style={{ backgroundColor: 'rgba(10, 15, 13, 0)', backdropFilter: 'blur(0px)' }}
        >
          <div className="container mx-auto px-4 py-3 flex items-center justify-between relative">
            <Link
              href="/"
              className="flex items-center justify-center w-11 h-11 rounded-full bg-white/10 backdrop-blur-xl text-white hover:bg-white/20 transition-all duration-300 border border-white/20 shadow-lg"
            >
              <ChevronLeft size={22} strokeWidth={2.5} />
            </Link>

            <div className="absolute left-1/2 transform -translate-x-1/2">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-[#1A2421] backdrop-blur-xl overflow-hidden border-2 border-[#708238] shadow-2xl hover:scale-105 transition-transform duration-300">
                <Image src="/images/logo/yaba_logo.png" alt="YABA" width={64} height={64} className="rounded-full" />
              </div>
            </div>

            <div className="w-11" /> {/* Spacer for alignment */}
          </div>
        </header>

        {/* Main Content */}
        <div className="relative pt-28 sm:pt-32 pb-12 sm:pb-20 px-3 sm:px-4">
          <div className="container mx-auto max-w-4xl">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-8 sm:mb-12"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, type: 'spring' }}
                className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-[#708238] to-[#F0FFF0] mb-4 sm:mb-6 shadow-2xl shadow-[#708238]/50"
              >
                <Coffee className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-[#0A0F0D]" />
              </motion.div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4 leading-[1.1] tracking-tight px-4">
                {['Buy', 'Me', 'Coffee'].map((word, i) => (
                  <motion.span
                    key={i}
                    initial={{ y: 40, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.1 * i }}
                    className="inline-block mr-2"
                  >
                    {word}
                  </motion.span>
                ))}
              </h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="text-sm sm:text-base md:text-lg text-white/70 max-w-2xl mx-auto px-4"
              >
                Support Yaba&apos;s music journey! Your contribution helps create more authentic Kenyan Rhumba.
              </motion.p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-xl"
            >
              {/* Amount Selection */}
              <div className="p-4 sm:p-6 md:p-8 border-b border-white/10">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-1 sm:mb-2 tracking-tight inline-flex items-center">
                  <div className="w-1 h-6 sm:h-8 bg-gradient-to-b from-[#708238] to-[#F0FFF0] rounded-full mr-2 sm:mr-3" />
                  Choose Your Amount
                </h2>
                <p className="text-xs sm:text-sm text-white/60 mb-4 sm:mb-6">Every cup of coffee makes a difference ☕</p>

                {/* Preset Amounts */}
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 sm:gap-3 md:gap-4 mb-4 sm:mb-6">
                  {PRESET_AMOUNTS.map((amount, index) => (
                    <motion.button
                      key={amount}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      onClick={() => handlePresetClick(amount)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`relative py-3 sm:py-4 md:py-5 px-2 sm:px-3 md:px-4 rounded-lg sm:rounded-xl font-bold text-sm sm:text-base md:text-lg transition-all ${selectedPreset === amount
                        ? 'bg-gradient-to-br from-[#708238] to-[#F0FFF0] text-[#0A0F0D] shadow-lg shadow-[#708238]/50'
                        : 'bg-white/5 border border-white/10 text-white/80 hover:border-[#708238]/50'
                        }`}
                    >
                      <div className="text-[10px] sm:text-xs md:text-sm opacity-75 mb-0.5 sm:mb-1">KES</div>
                      <div className="text-sm sm:text-base md:text-lg">{amount.toLocaleString()}</div>
                    </motion.button>
                  ))}
                </div>

                {/* Custom Amount */}
                <div className="relative">
                  <label className="block text-xs sm:text-sm font-semibold mb-2 text-[#708238]">
                    Or Enter Custom Amount
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-[#708238] font-bold text-base sm:text-lg">
                      KES
                    </div>
                    <input
                      type="text"
                      value={customAmount}
                      onChange={handleCustomAmountChange}
                      className="w-full pl-12 sm:pl-16 pr-3 sm:pr-4 py-3 sm:py-4 bg-white/5 border border-white/10 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-[#708238] focus:border-transparent text-white text-base sm:text-lg font-bold placeholder-white/30"
                      placeholder="Enter amount (min. 50)"
                    />
                  </div>
                  <p className="text-[10px] sm:text-xs text-white/50 mt-1.5 sm:mt-2">Minimum amount: KES 50</p>
                </div>

                {/* Total Display */}
                <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-gradient-to-r from-[#708238]/20 to-[#F0FFF0]/10 rounded-lg sm:rounded-xl border border-[#708238]/40">
                  <div className="flex items-center justify-between">
                    <span className="text-white/80 text-sm sm:text-base">You&apos;re sending:</span>
                    <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#708238]">
                      KES {getAmount().toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Payment Form */}
              <div className="p-4 sm:p-6 md:p-8">
                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                  {/* Contact Information */}
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 tracking-tight inline-flex items-center">
                      <div className="w-1 h-5 sm:h-6 bg-gradient-to-b from-[#708238] to-[#F0FFF0] rounded-full mr-2 sm:mr-3" />
                      Your Information
                    </h3>
                    <div className="space-y-3 sm:space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        <div>
                          <label htmlFor="firstName" className="block text-xs sm:text-sm font-medium mb-1.5 sm:mb-2 text-white/70">
                            First Name *
                          </label>
                          <input
                            type="text"
                            id="firstName"
                            name="firstName"
                            required
                            value={formData.firstName}
                            onChange={handleInputChange}
                            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#708238] focus:border-transparent text-white placeholder-white/40 text-sm sm:text-base"
                            placeholder="John"
                          />
                        </div>
                        <div>
                          <label htmlFor="lastName" className="block text-xs sm:text-sm font-medium mb-1.5 sm:mb-2 text-white/70">
                            Last Name *
                          </label>
                          <input
                            type="text"
                            id="lastName"
                            name="lastName"
                            required
                            value={formData.lastName}
                            onChange={handleInputChange}
                            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#708238] focus:border-transparent text-white placeholder-white/40 text-sm sm:text-base"
                            placeholder="Doe"
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="email" className="block text-xs sm:text-sm font-medium mb-1.5 sm:mb-2 text-white/70">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#708238] focus:border-transparent text-white placeholder-white/40 text-sm sm:text-base"
                          placeholder="john@example.com"
                        />
                      </div>

                      <div>
                        <label htmlFor="message" className="block text-xs sm:text-sm font-medium mb-1.5 sm:mb-2 text-white/70">
                          Leave a Message (Optional)
                        </label>
                        <textarea
                          id="message"
                          name="message"
                          rows={3}
                          value={formData.message}
                          onChange={handleInputChange}
                          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#708238] focus:border-transparent text-white placeholder-white/40 resize-none text-sm sm:text-base"
                          placeholder="Say something nice to Yaba..."
                        />
                      </div>
                    </div>
                  </div>

                  {/* Payment Method Info */}
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 tracking-tight inline-flex items-center">
                      <div className="w-1 h-5 sm:h-6 bg-gradient-to-b from-[#708238] to-[#F0FFF0] rounded-full mr-2 sm:mr-3" />
                      Payment Method
                    </h3>

                    <div className="p-3 sm:p-4 bg-[#708238]/10 rounded-lg sm:rounded-xl border border-[#708238]/30">
                      <div className="flex items-start gap-2 sm:gap-3">
                        <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#708238]/20 flex items-center justify-center">
                          <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-[#708238]" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-white mb-1.5 sm:mb-2 text-sm sm:text-base">Secure Payment via Paystack</h4>
                          <p className="text-xs sm:text-sm text-white/80 mb-1.5 sm:mb-2">
                            When you click &quot;Send Coffee&quot;, you&apos;ll be redirected to Paystack&apos;s secure checkout where you can pay with:
                          </p>
                          <ul className="text-xs sm:text-sm text-white/70 space-y-1">
                            <li className="flex items-center gap-1.5 sm:gap-2">
                              <Check className="w-3 h-3 sm:w-4 sm:h-4 text-[#708238] flex-shrink-0" />
                              M-Pesa
                            </li>
                            <li className="flex items-center gap-1.5 sm:gap-2">
                              <Check className="w-3 h-3 sm:w-4 sm:h-4 text-[#708238] flex-shrink-0" />
                              Credit/Debit Card (Visa, Mastercard)
                            </li>
                            <li className="flex items-center gap-1.5 sm:gap-2">
                              <Check className="w-3 h-3 sm:w-4 sm:h-4 text-[#708238] flex-shrink-0" />
                              Bank Transfer
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <motion.button
                    type="submit"
                    disabled={getAmount() < 50}
                    whileHover={{ scale: getAmount() >= 50 ? 1.02 : 1 }}
                    whileTap={{ scale: getAmount() >= 50 ? 0.98 : 1 }}
                    className="w-full py-3 sm:py-4 px-4 sm:px-6 bg-gradient-to-r from-[#708238] to-[#F0FFF0] hover:from-[#F0FFF0] hover:to-[#708238] disabled:from-[#708238]/50 disabled:to-[#F0FFF0]/50 disabled:cursor-not-allowed text-[#0A0F0D] font-bold rounded-lg sm:rounded-xl transition-all shadow-xl shadow-[#708238]/30 flex items-center justify-center gap-2 text-sm sm:text-base"
                  >
                    <Coffee className="w-4 h-4 sm:w-5 sm:h-5" />
                    Send Coffee • KES {getAmount().toLocaleString()}
                  </motion.button>

                  <p className="text-[10px] sm:text-xs text-center text-white/50">
                    Secure payment powered by Paystack
                  </p>
                </form>
              </div>
            </motion.div>

            {/* Info Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4"
            >
              {[
                { icon: Shield, title: 'Secure Payment', desc: 'Encrypted & safe' },
                { icon: Heart, title: 'Direct Support', desc: '100% to Yaba' },
                { icon: Music, title: 'More Music', desc: 'Fund new tracks' }
              ].map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
                    className="relative overflow-hidden rounded-lg sm:rounded-xl p-4 sm:p-5 group hover:scale-[1.02] transition-all duration-300 bg-white/5 backdrop-blur-xl border border-white/10 text-center"
                  >
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-[#708238]/20" />
                    <div className="relative z-10">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2 sm:mb-3 rounded-full bg-gradient-to-br from-[#708238] to-[#F0FFF0] flex items-center justify-center">
                        <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-[#0A0F0D]" />
                      </div>
                      <h4 className="font-semibold text-white mb-0.5 sm:mb-1 text-sm sm:text-base">{item.title}</h4>
                      <p className="text-[10px] sm:text-xs text-white/60">{item.desc}</p>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </div>

        {/* Footer */}
        <footer className="relative py-8 bg-[#0D1311] border-t border-[#708238]/30">
          <div className="container mx-auto px-4">
            <div className="flex flex-col items-center justify-center gap-4 text-sm text-white/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#708238]">
                  <Image src="/images/logo/yaba_logo.png" alt="YABA" width={40} height={40} />
                </div>
                <span className="font-bold text-base text-white">YABA</span>
              </div>
              <p className="text-center">© 2026 YABA. All rights reserved.</p>
              <p className="text-center">
                Powered by{' '}
                <a
                  href="https://soldoutafrica.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#708238] hover:text-[#F0FFF0] transition-colors underline"
                >
                  SoldOutAfrica
                </a>
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
