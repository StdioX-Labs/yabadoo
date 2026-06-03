'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Copy, Check, ArrowRight, Loader2 } from 'lucide-react';

function PaymentCallbackContent() {
  const searchParams = useSearchParams();
  const trxref = searchParams.get('trxref') || '';
  const reference = searchParams.get('reference') || trxref;
  const amount = searchParams.get('amount') || '';
  const currency = searchParams.get('currency') || 'KES';

  const [progress, setProgress] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [dots, setDots] = useState([0, 1, 2]);

  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const dotsRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const maxPollRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pollRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const queryPaymentStatus = async () => {
    try {
      const response = await fetch(`/api/event/ticket/group/${trxref}`);

      if (!response.ok) {
        window.location.href = '/payments/failed';
        return;
      }

      const data = await response.json();

      if (!data || !data.status) {
        window.location.href = '/payments/failed';
        return;
      }

      const tickets: Array<{ status: string }> = data.tickets || [];
      const hasValidTicket = tickets.some((t) => t.status === 'VALID');

      if (hasValidTicket) {
        localStorage.setItem('wintG', JSON.stringify(data));
        setTimeout(() => {
          window.location.href = '/payments/success';
        }, 10);
        return;
      }

      pollRef.current = setTimeout(queryPaymentStatus, 3000);
    } catch {
      window.location.href = '/payments/failed';
    }
  };

  useEffect(() => {
    if (!trxref) return;

    queryPaymentStatus();

    maxPollRef.current = setTimeout(() => {
      window.location.href = '/payments/failed';
    }, 5 * 60 * 1000);

    progressRef.current = setInterval(() => {
      setProgress((prev) => (prev >= 95 ? 95 : prev + 1));
    }, 300);

    timerRef.current = setInterval(() => {
      setElapsedTime((prev) => prev + 1);
    }, 1000);

    dotsRef.current = setInterval(() => {
      setDots((prev) => prev.map((_, i) => (i + prev[0] + 1) % 3));
    }, 500);

    return () => {
      if (progressRef.current) clearInterval(progressRef.current);
      if (timerRef.current) clearInterval(timerRef.current);
      if (dotsRef.current) clearInterval(dotsRef.current);
      if (maxPollRef.current) clearTimeout(maxPollRef.current);
      if (pollRef.current) clearTimeout(pollRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trxref]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const copyToClipboard = (value: string, field: string) => {
    navigator.clipboard.writeText(value).then(() => {
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    });
  };

  const paybillItems = [
    { label: 'Business Number', value: '4145653', field: 'paybill' },
    { label: 'Account Number', value: trxref, field: 'account' },
    ...(amount
      ? [{ label: 'Amount', value: `${Number(amount).toFixed(2)}`, field: 'amount' }]
      : []),
  ];

  return (
    <div className="min-h-screen bg-[#0A0F0D] text-[#F0FFF0] flex flex-col">
      {/* Header */}
      <div className="border-b border-[#708238]/20 px-4 py-4">
        <div className="max-w-xl mx-auto flex items-center justify-between">
          <span className="font-bold text-lg tracking-wider">YABA</span>
          <span className="text-xs text-[#F0FFF0]/40 font-mono">{trxref}</span>
        </div>
      </div>

      <main className="flex-1 flex items-start justify-center py-12 px-4">
        <div className="w-full max-w-xl flex flex-col gap-6">
          {/* Title — shown first on mobile */}
          <div className="text-center order-1">
            <h1 className="text-4xl font-black tracking-tight mb-3">PROCESSING PAYMENT</h1>
            <p className="text-[#F0FFF0]/60">
              Please wait while we confirm your transaction
              <span className="inline-block ml-1">
                {dots.map((dot, i) => (
                  <span
                    key={i}
                    className="inline-block mx-0.5 transition-transform duration-300"
                    style={{
                      transform: `translateY(${dot === 0 ? '-4px' : dot === 1 ? '0px' : '4px'})`,
                      opacity: dot === 1 ? 1 : 0.6,
                    }}
                  >
                    .
                  </span>
                ))}
              </span>
            </p>
          </div>

          {/* Offline Paybill — priority on mobile (order-2), below loader on desktop */}
          <div className="border border-[#708238]/30 rounded-2xl p-6 bg-[#0D1311] order-2 md:order-5">
            <p className="text-xs font-semibold tracking-widest text-[#708238]/60 mb-1 uppercase">Alternative</p>
            <h2 className="text-base font-bold mb-2">Pay via M-Pesa Paybill</h2>
            <p className="text-sm text-[#F0FFF0]/50 mb-5 leading-relaxed">
              If the STK push didn&apos;t arrive, open M-Pesa → Lipa na M-Pesa → Pay Bill and use the details
              below. This page confirms automatically once payment is received.
            </p>

            <div className="space-y-1">
              {paybillItems.map(({ label, value, field }) => (
                <div
                  key={field}
                  className="flex items-center justify-between py-3 border-b border-[#708238]/10 last:border-0"
                >
                  <span className="text-sm text-[#F0FFF0]/50">{label}</span>
                  <button
                    onClick={() => copyToClipboard(value, field)}
                    className="flex items-center gap-2 group"
                  >
                    <span className="font-mono font-bold tracking-wider">
                      {field === 'amount' ? `${currency} ${value}` : value}
                    </span>
                    {copiedField === field ? (
                      <Check className="w-4 h-4 text-[#708238] shrink-0" />
                    ) : (
                      <Copy className="w-4 h-4 text-[#F0FFF0]/30 group-hover:text-[#708238] shrink-0 transition-colors" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Animated Loader */}
          <div className="flex justify-center order-3 md:order-2">
            <div className="relative w-32 h-32">
              <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="#708238" strokeOpacity="0.15" strokeWidth="8" />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="#708238"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray="283"
                  strokeDashoffset={283 - (283 * progress) / 100}
                  style={{ transition: 'stroke-dashoffset 0.5s ease' }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 bg-[#0D1311] border border-[#708238]/30 rounded-full flex items-center justify-center">
                  <span className="text-lg font-bold text-[#708238]">{progress}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Transaction Details */}
          <div className="bg-[#0D1311] border border-[#708238]/20 rounded-2xl p-6 order-4 md:order-3">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-[#F0FFF0]/50">Transaction Reference</span>
                <span className="font-mono text-sm">{trxref || '—'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-[#F0FFF0]/50">Reference</span>
                <span className="font-mono text-sm">{reference || '—'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-[#F0FFF0]/50">Elapsed Time</span>
                <span className="font-mono text-sm">{formatTime(elapsedTime)}</span>
              </div>
            </div>
          </div>

          {/* Status note */}
          <p className="text-center text-sm text-[#F0FFF0]/40 order-5 md:order-4">
            This may take up to 2 minutes. Do not close this page.
          </p>

          {/* Cancel */}
          <div className="text-center order-6">
            <Link
              href="/"
              className="inline-flex items-center text-sm text-[#F0FFF0]/40 hover:text-[#F0FFF0]/70 transition-colors border-b border-[#708238]/20 pb-1"
            >
              CANCEL AND RETURN HOME
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function PaymentCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0A0F0D] flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#708238]" />
        </div>
      }
    >
      <PaymentCallbackContent />
    </Suspense>
  );
}
