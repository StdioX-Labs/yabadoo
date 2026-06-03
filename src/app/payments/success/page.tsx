'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Check, Ticket, ArrowRight } from 'lucide-react';

interface TicketData {
  status: string;
  ticketName?: string;
  ticketGroupCode?: string;
  createdAt?: string;
}

interface EventDetails {
  event?: string;
  tickets?: TicketData[];
  ticketPrice?: number;
  posterUrl?: string;
}

const TICKET_BASE_URL = 'https://ticket.soldoutafrica.com/';

export default function PaymentSuccessPage() {
  const [eventDetails, setEventDetails] = useState<EventDetails | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('wintG');
      if (stored) {
        setEventDetails(JSON.parse(stored));
      }
    } catch {
      // ignore parse errors
    }
  }, []);

  const firstTicket = eventDetails?.tickets?.[0];
  const ticketGroupCode = firstTicket?.ticketGroupCode || '';
  const ticketName = firstTicket?.ticketName || 'Standard Ticket';
  const purchaseDate = firstTicket?.createdAt
    ? new Date(firstTicket.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'Recent purchase';
  const totalAmount = eventDetails?.ticketPrice
    ? `KES ${Number(eventDetails.ticketPrice).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`
    : null;
  const ticketCount = eventDetails?.tickets?.length ?? 0;
  const eventName = eventDetails?.event || 'Your Event';
  const posterUrl = eventDetails?.posterUrl;

  if (!eventDetails) {
    return (
      <div className="min-h-screen bg-[#0A0F0D] text-[#F0FFF0] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 rounded-full bg-[#708238]/20 flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-[#708238]" />
          </div>
          <h1 className="text-3xl font-bold mb-3">PAYMENT SUCCESSFUL</h1>
          <p className="text-[#F0FFF0]/60 mb-8">
            Your tickets have been confirmed. Check your email and SMS for delivery.
          </p>
          <Link
            href="/events"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#708238] text-[#0A0F0D] font-bold rounded-lg hover:bg-[#F0FFF0] transition-all"
          >
            EXPLORE MORE EVENTS
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0F0D] text-[#F0FFF0]">
      <div className="container mx-auto px-4 py-16 max-w-3xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-24 h-24 rounded-full bg-[#708238] flex items-center justify-center mx-auto mb-8 shadow-lg shadow-[#708238]/30">
            <Check className="w-12 h-12 text-[#0A0F0D]" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">PAYMENT SUCCESSFUL</h1>
          <p className="text-lg text-[#F0FFF0]/60">Your tickets have been confirmed and sent to your email</p>
        </div>

        {/* Order Card */}
        <div className="bg-[#0D1311] border border-[#708238]/30 rounded-2xl overflow-hidden mb-10">
          {/* Event Banner */}
          <div className="relative h-40 bg-gradient-to-r from-[#708238]/20 to-[#0A0F0D] overflow-hidden">
            {posterUrl && (
              <img src={posterUrl} alt={eventName} className="w-full h-full object-cover opacity-50" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0D1311] to-transparent" />
            <div className="absolute bottom-0 left-0 p-6">
              <h2 className="text-2xl font-bold">{eventName}</h2>
            </div>
          </div>

          {/* Details */}
          <div className="p-6 md:p-8">
            {ticketGroupCode && (
              <div className="flex justify-between items-center pb-4 mb-4 border-b border-[#708238]/20">
                <span className="text-sm text-[#F0FFF0]/50">Ticket Group Code</span>
                <span className="font-bold font-mono">{ticketGroupCode}</span>
              </div>
            )}

            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-sm text-[#F0FFF0]/50">Ticket Type</span>
                <span>{ticketName}</span>
              </div>
              {ticketCount > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-[#F0FFF0]/50">Total Tickets</span>
                  <span>{ticketCount}</span>
                </div>
              )}
              <div className="flex justify-between items-center">
                <span className="text-sm text-[#F0FFF0]/50">Purchase Date</span>
                <span>{purchaseDate}</span>
              </div>
            </div>

            {totalAmount && (
              <div className="flex justify-between items-center pt-4 border-t border-[#708238]/20">
                <span className="text-sm font-medium">Total Amount</span>
                <span className="text-xl font-black text-[#708238]">{totalAmount}</span>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col md:flex-row gap-4 justify-center mb-12">
          {ticketGroupCode && (
            <a
              href={`${TICKET_BASE_URL}${ticketGroupCode}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 px-8 py-4 bg-[#708238] text-[#0A0F0D] font-bold rounded-lg hover:bg-[#F0FFF0] transition-all text-center"
            >
              <Ticket className="w-4 h-4" />
              VIEW TICKETS
            </a>
          )}
          <Link
            href="/events"
            className="flex-1 flex items-center justify-center gap-2 px-8 py-4 border border-[#708238]/30 rounded-lg hover:bg-[#708238]/10 transition-all text-center"
          >
            EXPLORE MORE EVENTS
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <p className="text-center text-sm text-[#F0FFF0]/40">
          Didn&apos;t receive your tickets? Contact support or check your spam folder.
        </p>
      </div>
    </div>
  );
}
