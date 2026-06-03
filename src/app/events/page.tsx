"use client";

import { useEffect, useState } from "react";
import { Calendar, MapPin, ChevronLeft, Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

interface Event {
    id: number;
    eventName: string;
    eventDescription: string;
    eventPosterUrl: string;
    eventLocation: string;
    eventStartDate: string;
    tickets: Array<{
        id: number;
        ticketPrice: number;
        isSoldOut: boolean;
    }>;
    companyName: string;
    category: string;
    date: string;
    time: string;
    isFeatured: boolean;
    price: number;
    currency: string;
}

export default function EventsPage() {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                setLoading(true);
                const response = await fetch('/api/events');
                const data = await response.json();

                if (data.success) {
                    const list: Event[] = data.events;
                    if (list.length === 1) {
                        // Skip the listing page entirely — go straight to the event
                        router.replace(`/events/${list[0].id}`);
                        return;
                    }
                    setEvents(list);
                } else {
                    setError('Failed to load events');
                }
            } catch {
                setError('Failed to load events');
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, [router]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0A0F0D] flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-[#708238] animate-spin" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-[#0A0F0D] flex items-center justify-center px-4">
                <div className="text-center">
                    <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-4" />
                    <p className="text-white/60 mb-4">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-6 py-2.5 bg-[#708238] text-[#0A0F0D] rounded-xl font-bold hover:bg-[#F0FFF0] transition-all"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    const featured = events.filter(e => e.isFeatured);
    const rest = events.filter(e => !e.isFeatured);

    return (
        <div className="bg-[#0A0F0D] text-[#F0FFF0] min-h-screen">
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-[#0A0F0D]/80 backdrop-blur-xl border-b border-white/5">
                <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
                    <Link
                        href="/"
                        className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all"
                    >
                        <ChevronLeft size={18} />
                    </Link>
                    <Image src="/images/logo/yaba_logo.png" alt="YABA" width={40} height={40} className="rounded-full" />
                    <div className="w-9" />
                </div>
            </header>

            <div className="max-w-6xl mx-auto px-4 pt-24 pb-16">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-10"
                >
                    <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-2">Events</h1>
                    <p className="text-white/50">Experience unforgettable moments with YABA</p>
                </motion.div>

                {/* Featured events — large cards */}
                {featured.length > 0 && (
                    <div className="mb-10">
                        <p className="text-xs font-bold uppercase tracking-widest text-[#708238] mb-4">Featured</p>
                        <div className="grid sm:grid-cols-2 gap-5">
                            {featured.map((event, i) => (
                                <FeaturedCard key={event.id} event={event} index={i} />
                            ))}
                        </div>
                    </div>
                )}

                {/* All other events */}
                {rest.length > 0 && (
                    <div>
                        {featured.length > 0 && (
                            <p className="text-xs font-bold uppercase tracking-widest text-white/40 mb-4">All Events</p>
                        )}
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                            {rest.map((event, i) => (
                                <EventCard key={event.id} event={event} index={i} />
                            ))}
                        </div>
                    </div>
                )}

                {events.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-24 text-center">
                        <Calendar className="w-10 h-10 text-white/20 mb-4" />
                        <p className="text-white/50 text-lg">No upcoming events</p>
                        <p className="text-white/30 text-sm mt-1">Check back soon</p>
                    </div>
                )}
            </div>
        </div>
    );
}

function FeaturedCard({ event, index }: { event: Event; index: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.08 }}
        >
            <Link href={`/events/${event.id}`}>
                <div className="group relative overflow-hidden rounded-2xl border border-white/10 hover:border-[#708238]/50 transition-all duration-300 aspect-[4/3]">
                    <Image
                        src={event.eventPosterUrl}
                        alt={event.eventName}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                    {/* Top badges */}
                    <div className="absolute top-3 left-3 flex gap-2">
                        <span className="px-2.5 py-1 text-xs font-bold bg-[#708238] text-[#0A0F0D] rounded-full">
                            FEATURED
                        </span>
                        <span className="px-2.5 py-1 text-xs bg-black/50 backdrop-blur-sm text-white rounded-full">
                            {event.category}
                        </span>
                    </div>

                    {/* Bottom content */}
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                        <h3 className="text-xl font-black mb-2 leading-tight">{event.eventName}</h3>
                        <div className="flex items-center gap-3 text-xs text-white/70 mb-3">
                            <span className="flex items-center gap-1"><Calendar size={11} /> {event.date}</span>
                            <span className="flex items-center gap-1"><MapPin size={11} /> {event.eventLocation}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-bold text-[#708238]">
                                From {event.currency} {event.price.toLocaleString()}
                            </span>
                            <span className="px-3 py-1.5 bg-[#708238] text-[#0A0F0D] text-xs font-bold rounded-lg group-hover:bg-[#F0FFF0] transition-colors">
                                Get Tickets
                            </span>
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}

function EventCard({ event, index }: { event: Event; index: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.06 }}
        >
            <Link href={`/events/${event.id}`}>
                <div className="group overflow-hidden rounded-2xl border border-white/10 hover:border-[#708238]/40 bg-white/[0.03] hover:bg-white/[0.05] transition-all duration-300 flex flex-col">
                    {/* Image */}
                    <div className="relative aspect-[16/9] overflow-hidden">
                        <Image
                            src={event.eventPosterUrl}
                            alt={event.eventName}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                        <span className="absolute top-3 left-3 px-2.5 py-1 text-xs bg-black/60 backdrop-blur-sm text-white/80 rounded-full">
                            {event.category}
                        </span>
                        <span className="absolute bottom-3 right-3 px-2.5 py-1 text-xs font-bold bg-[#708238] text-[#0A0F0D] rounded-lg">
                            {event.currency} {event.price.toLocaleString()}
                        </span>
                    </div>

                    {/* Details */}
                    <div className="p-4 flex flex-col flex-1">
                        <h3 className="font-bold text-base mb-2 group-hover:text-[#708238] transition-colors line-clamp-2 leading-snug">
                            {event.eventName}
                        </h3>
                        <div className="space-y-1.5 text-xs text-white/55 mt-auto pt-3 border-t border-white/10">
                            <div className="flex items-center gap-1.5">
                                <Calendar size={12} className="text-[#708238] shrink-0" />
                                <span>{event.date} · {event.time}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <MapPin size={12} className="text-[#708238] shrink-0" />
                                <span className="line-clamp-1">{event.eventLocation}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}
