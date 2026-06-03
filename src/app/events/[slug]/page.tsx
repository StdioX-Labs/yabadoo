'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Calendar,
  MapPin,
  ChevronLeft,
  Users,
  Share2,
  Loader2,
  AlertCircle,
  Minus,
  Plus,
  Ticket,
} from 'lucide-react';

interface TicketType {
  id: number;
  ticketName: string;
  ticketPrice: number;
  quantityAvailable: number;
  soldQuantity: number;
  isActive: boolean;
  isSoldOut: boolean;
}

interface Event {
  id: number;
  eventName: string;
  eventDescription: string;
  eventPosterUrl: string;
  eventLocation: string;
  eventStartDate: string;
  eventEndDate: string;
  tickets: TicketType[];
  companyName: string;
  category: string;
  date: string;
  time: string;
  price: number;
  slug: string;
  currency: string;
}

function TicketStepper({
  ticket,
  quantity,
  currency,
  onIncrease,
  onDecrease,
}: {
  ticket: TicketType;
  quantity: number;
  currency: string;
  onIncrease: () => void;
  onDecrease: () => void;
}) {
  const remaining = ticket.quantityAvailable - ticket.soldQuantity;
  const atMax = quantity >= remaining;

  return (
    <div className={`rounded-xl border transition-all duration-200 ${quantity > 0 ? 'border-[#708238] bg-[#708238]/5' : 'border-white/10 bg-white/5'}`}>
      <div className="p-4 flex items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="font-semibold text-[#F0FFF0] truncate">{ticket.ticketName}</p>
          <p className="text-[#708238] font-bold mt-0.5">
            {currency} {ticket.ticketPrice.toLocaleString()}
          </p>
          {remaining < 15 && (
            <p className="text-xs text-amber-400 mt-1">{remaining} left</p>
          )}
          {ticket.isSoldOut && (
            <p className="text-xs text-red-400 mt-1">Sold out</p>
          )}
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={onDecrease}
            disabled={quantity === 0}
            className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center hover:border-[#708238] hover:bg-[#708238]/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <span className="w-8 text-center font-bold text-lg select-none">{quantity}</span>
          <button
            onClick={onIncrease}
            disabled={ticket.isSoldOut || atMax}
            className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center hover:border-[#708238] hover:bg-[#708238]/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function EventPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTickets, setSelectedTickets] = useState<Record<number, number>>({});

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/events/${slug}?eventId=${slug}`);
        const data = await response.json();
        if (data.success) {
          setEvent(data.event);
        } else {
          setError('Event not found');
        }
      } catch {
        setError('Failed to load event');
      } finally {
        setLoading(false);
      }
    };
    if (slug) fetchEvent();
  }, [slug]);

  const getTotalTickets = () => Object.values(selectedTickets).reduce((s, q) => s + q, 0);

  const getTotalPrice = () => {
    if (!event) return 0;
    return Object.entries(selectedTickets).reduce((total, [id, qty]) => {
      const t = event.tickets.find(t => t.id === parseInt(id));
      return total + (t?.ticketPrice || 0) * qty;
    }, 0);
  };

  const updateQty = (ticketId: number, delta: number) => {
    setSelectedTickets(prev => {
      const next = Math.max(0, (prev[ticketId] || 0) + delta);
      if (next === 0) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { [ticketId]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [ticketId]: next };
    });
  };

  const handleCheckout = () => {
    if (getTotalTickets() === 0 || !event) return;
    const ticketData = Object.entries(selectedTickets).map(([id, qty]) => {
      const t = event.tickets.find(t => t.id === parseInt(id));
      return { ticketId: parseInt(id), ticketName: t?.ticketName, quantity: qty, price: t?.ticketPrice };
    });
    const params = new URLSearchParams({
      eventId: event.id.toString(),
      tickets: JSON.stringify(ticketData),
    });
    router.push(`/events/${slug}/checkout?${params.toString()}`);
  };

  const handleShare = async () => {
    if (!event) return;
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({ title: event.eventName, url }).catch(() => {});
    } else {
      await navigator.clipboard.writeText(url).catch(() => {});
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0F0D] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-[#708238] animate-spin" />
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-[#0A0F0D] flex items-center justify-center px-4">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Event Not Found</h1>
          <p className="text-white/60 mb-6">{error}</p>
          <Link href="/events" className="inline-flex items-center gap-2 px-6 py-3 bg-[#708238] text-[#0A0F0D] rounded-xl font-bold hover:bg-[#F0FFF0] transition-all">
            <ChevronLeft size={18} /> Back to Events
          </Link>
        </div>
      </div>
    );
  }

  const totalTickets = getTotalTickets();
  const totalPrice = getTotalPrice();
  const isSingleTicketType = event.tickets.length === 1;
  const singleTicket = isSingleTicketType ? event.tickets[0] : null;

  return (
    <div className="relative bg-[#0A0F0D] text-[#F0FFF0] min-h-screen">
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0A0F0D]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link
            href="/events"
            className="flex items-center gap-2 text-sm text-white/70 hover:text-[#F0FFF0] transition-colors group"
          >
            <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-all">
              <ChevronLeft size={18} />
            </div>
            <span className="hidden sm:inline">Events</span>
          </Link>

          <Image src="/images/logo/yaba_logo.png" alt="YABA" width={40} height={40} className="rounded-full" />

          <button
            onClick={handleShare}
            className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all"
            aria-label="Share event"
          >
            <Share2 size={16} />
          </button>
        </div>
      </header>

      {/* Hero */}
      <div className="relative h-[55vh] min-h-[340px] max-h-[520px] overflow-hidden">
        <Image
          src={event.eventPosterUrl}
          alt={event.eventName}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0F0D] via-[#0A0F0D]/40 to-transparent" />

        {/* Category badge */}
        <div className="absolute top-20 left-4 sm:left-6">
          <span className="px-3 py-1 text-xs font-semibold uppercase tracking-widest bg-[#708238] text-[#0A0F0D] rounded-full">
            {event.category}
          </span>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-6xl mx-auto px-4 pb-32 lg:pb-12">
        <div className="lg:grid lg:grid-cols-[1fr_380px] lg:gap-10 lg:-mt-24 relative">

          {/* Left: Event Info */}
          <div className="py-6 lg:py-0">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black leading-tight tracking-tight mb-6">
                {event.eventName}
              </h1>

              <div className="flex flex-wrap gap-x-5 gap-y-2 mb-8 text-sm text-white/70">
                <div className="flex items-center gap-2">
                  <Calendar size={15} className="text-[#708238]" />
                  <span>{event.date} · {event.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={15} className="text-[#708238]" />
                  <span>{event.eventLocation}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users size={15} className="text-[#708238]" />
                  <span>By {event.companyName}</span>
                </div>
              </div>

              {/* Description */}
              <div className="border-t border-white/10 pt-6">
                <h2 className="text-lg font-bold mb-3 text-[#708238] uppercase tracking-widest text-xs">About</h2>
                <p className="text-white/75 leading-relaxed whitespace-pre-wrap text-[15px]">
                  {event.eventDescription}
                </p>
              </div>
            </motion.div>
          </div>

          {/* Right: Sticky Ticket Panel */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="hidden lg:block"
          >
            <div className="sticky top-20">
              <TicketPanel
                event={event}
                selectedTickets={selectedTickets}
                totalTickets={totalTickets}
                totalPrice={totalPrice}
                isSingleTicketType={isSingleTicketType}
                singleTicket={singleTicket}
                onUpdate={updateQty}
                onCheckout={handleCheckout}
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Mobile: Ticket section (above sticky bar) */}
      <div className="lg:hidden px-4 pb-4">
        <div className="border-t border-white/10 pt-6">
          <h2 className="text-xs font-bold uppercase tracking-widest text-[#708238] mb-4 flex items-center gap-2">
            <Ticket size={14} /> Tickets
          </h2>
          {isSingleTicketType && singleTicket ? (
            <TicketStepper
              ticket={singleTicket}
              quantity={selectedTickets[singleTicket.id] || 0}
              currency={event.currency}
              onIncrease={() => updateQty(singleTicket.id, 1)}
              onDecrease={() => updateQty(singleTicket.id, -1)}
            />
          ) : (
            <div className="space-y-3">
              {event.tickets.map(t => (
                <TicketStepper
                  key={t.id}
                  ticket={t}
                  quantity={selectedTickets[t.id] || 0}
                  currency={event.currency}
                  onIncrease={() => updateQty(t.id, 1)}
                  onDecrease={() => updateQty(t.id, -1)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile sticky bottom bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0A0F0D]/95 backdrop-blur-xl border-t border-white/10 px-4 py-4">
        {totalTickets > 0 ? (
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <p className="text-xs text-white/50">{totalTickets} ticket{totalTickets > 1 ? 's' : ''}</p>
              <p className="font-bold text-[#708238]">{event.currency} {totalPrice.toLocaleString()}</p>
            </div>
            <button
              onClick={handleCheckout}
              className="flex-1 py-3.5 bg-[#708238] text-[#0A0F0D] font-bold rounded-xl hover:bg-[#F0FFF0] transition-all text-sm uppercase tracking-wide"
            >
              Get Tickets
            </button>
          </div>
        ) : (
          <p className="text-center text-sm text-white/40">
            From {event.currency} {event.price.toLocaleString()} · Select tickets above
          </p>
        )}
      </div>
    </div>
  );
}

function TicketPanel({
  event,
  selectedTickets,
  totalTickets,
  totalPrice,
  isSingleTicketType,
  singleTicket,
  onUpdate,
  onCheckout,
}: {
  event: Event;
  selectedTickets: Record<number, number>;
  totalTickets: number;
  totalPrice: number;
  isSingleTicketType: boolean;
  singleTicket: TicketType | null;
  onUpdate: (id: number, delta: number) => void;
  onCheckout: () => void;
}) {
  return (
    <div className="bg-[#0D1311] border border-white/10 rounded-2xl overflow-hidden">
      {/* Panel header */}
      <div className="px-5 py-4 border-b border-white/10">
        <p className="text-xs font-bold uppercase tracking-widest text-[#708238] flex items-center gap-2">
          <Ticket size={13} /> Tickets
        </p>
        <div className="mt-2 flex items-center gap-3 text-xs text-white/50">
          <span className="flex items-center gap-1"><Calendar size={11} /> {event.date}</span>
          <span>·</span>
          <span className="flex items-center gap-1"><MapPin size={11} /> {event.eventLocation}</span>
        </div>
      </div>

      {/* Ticket list */}
      <div className="p-4 space-y-3">
        {isSingleTicketType && singleTicket ? (
          <TicketStepper
            ticket={singleTicket}
            quantity={selectedTickets[singleTicket.id] || 0}
            currency={event.currency}
            onIncrease={() => onUpdate(singleTicket.id, 1)}
            onDecrease={() => onUpdate(singleTicket.id, -1)}
          />
        ) : (
          event.tickets.map(t => (
            <TicketStepper
              key={t.id}
              ticket={t}
              quantity={selectedTickets[t.id] || 0}
              currency={event.currency}
              onIncrease={() => onUpdate(t.id, 1)}
              onDecrease={() => onUpdate(t.id, -1)}
            />
          ))
        )}
      </div>

      {/* Total + CTA */}
      <div className="px-5 pb-5 space-y-4">
        {totalTickets > 0 && (
          <div className="flex justify-between items-baseline border-t border-white/10 pt-4">
            <span className="text-sm text-white/60">{totalTickets} ticket{totalTickets > 1 ? 's' : ''}</span>
            <span className="font-black text-xl text-[#708238]">
              {event.currency} {totalPrice.toLocaleString()}
            </span>
          </div>
        )}

        <button
          onClick={onCheckout}
          disabled={totalTickets === 0}
          className="w-full py-4 bg-[#708238] text-[#0A0F0D] font-bold rounded-xl hover:bg-[#F0FFF0] transition-all disabled:opacity-30 disabled:cursor-not-allowed text-sm uppercase tracking-wide"
        >
          {totalTickets === 0
            ? `From ${event.currency} ${event.price.toLocaleString()}`
            : 'Get Tickets →'}
        </button>

        <p className="text-center text-xs text-white/30">
          Powered by SoldOutAfrica · Non-refundable
        </p>
      </div>
    </div>
  );
}
