'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
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
  X,
} from 'lucide-react';

interface Event {
  id: number;
  eventName: string;
  eventDescription: string;
  eventPosterUrl: string;
  eventLocation: string;
  eventStartDate: string;
  eventEndDate: string;
  tickets: Array<{
    id: number;
    ticketName: string;
    ticketPrice: number;
    quantityAvailable: number;
    soldQuantity: number;
    isActive: boolean;
    isSoldOut: boolean;
  }>;
  companyName: string;
  category: string;
  date: string;
  time: string;
  price: number;
  slug: string;
  currency: string;
}

export default function EventPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [selectedTickets, setSelectedTickets] = useState<Record<number, number>>({});

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        // The slug is actually the event ID passed from the listing page
        const response = await fetch(`/api/events/${slug}?eventId=${slug}`);
        const data = await response.json();

        if (data.success) {
          setEvent(data.event);
        } else {
          setError('Event not found');
        }
      } catch (err) {
        console.error('Error fetching event:', err);
        setError('Failed to load event');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchEvent();
    }
  }, [slug]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      setScrollProgress(scrollPercent);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


  const getTotalTickets = () => {
    return Object.values(selectedTickets).reduce((sum, qty) => sum + qty, 0);
  };

  const getTotalPrice = () => {
    if (!event) return 0;
    return Object.entries(selectedTickets).reduce((total, [ticketId, quantity]) => {
      const ticket = event.tickets.find(t => t.id === parseInt(ticketId));
      return total + (ticket?.ticketPrice || 0) * quantity;
    }, 0);
  };

  const updateTicketQuantity = (ticketId: number, change: number) => {
    setSelectedTickets(prev => {
      const currentQty = prev[ticketId] || 0;
      const newQty = Math.max(0, currentQty + change);

      if (newQty === 0) {
        // Remove ticket from selection
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { [ticketId]: removed, ...rest } = prev;
        return rest;
      }

      return { ...prev, [ticketId]: newQty };
    });
  };

  const handleProceedToCheckout = () => {
    if (getTotalTickets() === 0) return;

    const ticketData = Object.entries(selectedTickets)
      .map(([ticketId, quantity]) => {
        const ticket = event?.tickets.find(t => t.id === parseInt(ticketId));
        return {
          ticketId: parseInt(ticketId),
          ticketName: ticket?.ticketName,
          quantity,
          price: ticket?.ticketPrice,
        };
      });

    const queryParams = new URLSearchParams({
      eventId: event?.id.toString() || '',
      tickets: JSON.stringify(ticketData),
    });

    router.push(`/events/${slug}/checkout?${queryParams.toString()}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0F0D] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-[#708238] animate-spin mx-auto mb-4" />
          <p className="text-white/70">Loading event...</p>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-[#0A0F0D] flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Event Not Found</h1>
          <p className="text-white/70 mb-6">{error || 'The event you are looking for does not exist.'}</p>
          <Link
            href="/events"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#708238] text-[#0A0F0D] rounded-lg hover:bg-[#F0FFF0] transition-all"
          >
            <ChevronLeft size={20} />
            Back to Events
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="relative bg-[#0A0F0D] text-[#F0FFF0] min-h-screen">
      {/* Scroll Progress */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-[#1A2421] z-[100]">
        <div
          className="h-full bg-gradient-to-r from-[#708238] to-[#F0FFF0] transition-all duration-300"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0A0F0D]/95 backdrop-blur-xl border-b border-white/10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            href="/events"
            className="flex items-center justify-center w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 transition-all"
          >
            <ChevronLeft size={22} />
          </Link>

          <div className="absolute left-1/2 transform -translate-x-1/2">
            <Image src="/images/logo/yaba_logo.png" alt="YABA" width={48} height={48} className="rounded-full" />
          </div>

          <button className="flex items-center justify-center w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 transition-all">
            <Share2 size={20} />
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative aspect-[16/9] rounded-2xl overflow-hidden mb-8"
            >
              <Image
                src={event.eventPosterUrl}
                alt={event.eventName}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <div className="mb-4">
                <span className="inline-block px-4 py-1.5 text-xs uppercase tracking-widest rounded-full bg-[#708238]/20 text-[#708238] border border-[#708238]/40">
                  {event.category}
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">{event.eventName}</h1>

              <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex items-center gap-2 text-white/80">
                  <Calendar size={20} className="text-[#708238]" />
                  <span>{event.date} • {event.time}</span>
                </div>
                <div className="flex items-center gap-2 text-white/80">
                  <MapPin size={20} className="text-[#708238]" />
                  <span>{event.eventLocation}</span>
                </div>
                <div className="flex items-center gap-2 text-white/80">
                  <Users size={20} className="text-[#708238]" />
                  <span>By {event.companyName}</span>
                </div>
              </div>

              <button
                onClick={() => setShowTicketModal(true)}
                className="w-full sm:w-auto px-8 py-4 bg-[#708238] text-[#0A0F0D] rounded-lg font-bold text-lg hover:bg-[#F0FFF0] transition-all shadow-lg"
              >
                Get Tickets - From {event.currency} {event.price.toLocaleString()}
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Description Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">About This Event</h2>
            <div className="prose prose-invert max-w-none">
              <p className="text-white/80 leading-relaxed whitespace-pre-wrap">
                {event.eventDescription}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Ticket Modal */}
      <AnimatePresence>
        {showTicketModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-2xl bg-[#0D1311] rounded-2xl border-2 border-[#708238] overflow-hidden"
            >
              <button
                onClick={() => setShowTicketModal(false)}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-[#708238] transition-all z-10"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="p-6">
                <h3 className="text-2xl font-bold mb-6">Select Tickets</h3>

                <div className="space-y-4 mb-6">
                  {event.tickets.map((ticket) => (
                    <div
                      key={ticket.id}
                      className="p-6 border border-[#708238]/30 rounded-lg hover:border-[#708238] transition-all"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        <div className="flex-1">
                          <h4 className="font-bold text-lg mb-2">{ticket.ticketName}</h4>
                          <div className="flex items-baseline gap-2 mb-2">
                            <p className="text-2xl font-bold text-[#708238]">
                              {event.currency} {ticket.ticketPrice.toLocaleString()}
                            </p>
                          </div>
                          {(ticket.quantityAvailable - ticket.soldQuantity) < 15 && (
                            <p className="text-sm text-white/60">
                              {ticket.quantityAvailable - ticket.soldQuantity} available
                            </p>
                          )}
                        </div>

                        <div className="flex items-center">
                          <button
                            onClick={() => updateTicketQuantity(ticket.id, -1)}
                            disabled={!selectedTickets[ticket.id]}
                            className="w-10 h-10 flex items-center justify-center border border-[#708238]/30 hover:bg-[#708238]/20 rounded-l-lg transition-all disabled:opacity-50"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <div className="w-12 h-10 flex items-center justify-center border-t border-b border-[#708238]/30 font-bold">
                            {selectedTickets[ticket.id] || 0}
                          </div>
                          <button
                            onClick={() => updateTicketQuantity(ticket.id, 1)}
                            disabled={ticket.isSoldOut || (selectedTickets[ticket.id] || 0) >= ticket.quantityAvailable}
                            className="w-10 h-10 flex items-center justify-center border border-[#708238]/30 hover:bg-[#708238]/20 rounded-r-lg transition-all disabled:opacity-50"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-[#708238]/30 pt-6 mb-6">
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">Total Tickets</span>
                    <span className="font-medium">{getTotalTickets()}</span>
                  </div>
                  <div className="flex justify-between font-bold text-xl">
                    <span>TOTAL</span>
                    <span className="text-[#708238]">
                      {event.currency} {getTotalPrice().toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => setShowTicketModal(false)}
                    className="flex-1 px-6 py-3 rounded-lg border border-[#708238]/30 hover:bg-[#708238]/10 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleProceedToCheckout}
                    disabled={getTotalTickets() === 0}
                    className="flex-1 px-8 py-3 bg-[#708238] text-[#0A0F0D] font-bold rounded-lg hover:bg-[#F0FFF0] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Continue
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

