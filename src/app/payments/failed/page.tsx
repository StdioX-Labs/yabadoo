'use client';

import Link from 'next/link';
import { X, ArrowRight, RefreshCw, HelpCircle, Phone } from 'lucide-react';

const ERROR_CODE = 'ERR' + Math.floor(100000 + Math.random() * 900000);

const COMMON_ISSUES = [
  'Insufficient funds in your account',
  'Payment authorization was declined',
  'Network connectivity issues',
  'Mobile money service temporarily unavailable',
  'Transaction timeout due to delayed response',
];

export default function PaymentFailedPage() {
  const attemptDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="min-h-screen bg-[#0A0F0D] text-[#F0FFF0]">
      <div className="container mx-auto px-4 py-16 max-w-3xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-24 h-24 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-8">
            <X className="w-12 h-12 text-red-500" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">PAYMENT FAILED</h1>
          <p className="text-lg text-[#F0FFF0]/60">Your payment could not be processed at this time</p>
        </div>

        {/* Error Details Card */}
        <div className="bg-[#0D1311] border border-red-500/20 rounded-2xl overflow-hidden mb-10">
          <div className="p-6 md:p-8">
            <div className="flex justify-between items-center pb-4 mb-4 border-b border-[#708238]/20">
              <span className="text-sm text-[#F0FFF0]/50">Error Reference</span>
              <span className="font-bold font-mono text-red-400">{ERROR_CODE}</span>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-sm text-[#F0FFF0]/50">Payment Method</span>
                <span>Mobile Money / Card</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-[#F0FFF0]/50">Attempt Date</span>
                <span>{attemptDate}</span>
              </div>
            </div>

            <div className="bg-[#0A0F0D] border border-[#708238]/10 rounded-xl p-4">
              <h3 className="font-bold mb-3 flex items-center gap-2 text-sm">
                <HelpCircle className="w-4 h-4 text-[#708238]" />
                Common Issues
              </h3>
              <ul className="space-y-2 text-sm text-[#F0FFF0]/60">
                {COMMON_ISSUES.map((issue, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-[#708238] mt-0.5">•</span>
                    <span>{issue}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col md:flex-row gap-4 justify-center mb-12">
          <Link
            href="/events"
            className="flex-1 flex items-center justify-center gap-2 px-8 py-4 bg-[#708238] text-[#0A0F0D] font-bold rounded-lg hover:bg-[#F0FFF0] transition-all text-center"
          >
            <RefreshCw className="w-4 h-4" />
            TRY AGAIN
          </Link>
          <Link
            href="/"
            className="flex-1 flex items-center justify-center gap-2 px-8 py-4 border border-[#708238]/30 rounded-lg hover:bg-[#708238]/10 transition-all text-center"
          >
            RETURN HOME
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Support */}
        <div className="text-center">
          <p className="text-sm text-[#F0FFF0]/40 mb-4">Need help with your payment?</p>
          <div className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-[#708238]/20 rounded-full text-sm">
            <Phone className="w-4 h-4 text-[#708238]" />
            <span>Contact Support: +254 715 066 651</span>
          </div>
        </div>
      </div>
    </div>
  );
}
