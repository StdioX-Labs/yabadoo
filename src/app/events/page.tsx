"use client";

import { useEffect, useState, useRef } from "react";
import {
    Calendar,
    MapPin,
    Ticket,
    ChevronLeft,
    Loader2,
    AlertCircle,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

// Event interface
interface Event {
    id: number;
    eventName: string;
    eventDescription: string;
    eventPosterUrl: string;
    eventCategoryId: number;
    ticketSaleStartDate: string;
    ticketSaleEndDate: string;
    eventLocation: string;
    eventStartDate: string;
    eventEndDate: string;
    isActive: boolean;
    tickets: Array<{
        id: number;
        ticketName: string;
        ticketPrice: number;
        quantityAvailable: number;
        soldQuantity: number;
        isActive: boolean;
        isSoldOut: boolean;
    }>;
    createdById: number;
    companyId: number;
    companyName: string;
    category: string;
    date: string;
    time: string;
    isFeatured: boolean;
    price: number;
    slug: string;
    currency: string;
}

export default function EventsPage() {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [scrollProgress, setScrollProgress] = useState(0);
    const headerRef = useRef<HTMLElement>(null);

    // Fetch events from API
    useEffect(() => {
        const fetchEvents = async () => {
            try {
                setLoading(true);
                const response = await fetch('/api/events');
                const data = await response.json();

                if (data.success) {
                    setEvents(data.events);
                } else {
                    setError('Failed to load events');
                }
            } catch (err) {
                console.error('Error fetching events:', err);
                setError('Failed to load events');
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = (scrollTop / docHeight) * 100;

            setScrollProgress(scrollPercent);

            if (headerRef.current) {
                const scrollRatio = Math.min(window.scrollY / 200, 1);
                headerRef.current.style.backgroundColor = `rgba(10, 15, 13, ${scrollRatio * 0.95})`;
                headerRef.current.style.backdropFilter = `blur(${scrollRatio * 20}px)`;
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
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
                style={{ backgroundColor: "rgba(10, 15, 13, 0)", backdropFilter: "blur(0px)" }}
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

                    <div className="w-11" /> {/* Spacer */}
                </div>
            </header>

            {/* Main Content */}
            <div className="relative pt-32 pb-12 px-4">
                <div className="container mx-auto max-w-6xl">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center mb-12"
                    >
                        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 leading-[1.1] tracking-tight">
                            {['Upcoming', 'Events'].map((word, i) => (
                                <motion.span
                                    key={i}
                                    initial={{ y: 40, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ duration: 0.5, delay: 0.1 * i }}
                                    className="inline-block mr-3"
                                >
                                    {word}
                                </motion.span>
                            ))}
                        </h1>
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            className="text-lg text-white/70 max-w-2xl mx-auto"
                        >
                            Experience unforgettable moments with YABA
                        </motion.p>
                    </motion.div>

                    {/* Loading State */}
                    {loading && (
                        <div className="flex flex-col items-center justify-center py-20">
                            <Loader2 className="w-12 h-12 text-[#708238] animate-spin mb-4" />
                            <p className="text-white/70">Loading events...</p>
                        </div>
                    )}

                    {/* Error State */}
                    {error && !loading && (
                        <div className="flex flex-col items-center justify-center py-20">
                            <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
                            <p className="text-white/70 mb-4">{error}</p>
                            <button
                                onClick={() => window.location.reload()}
                                className="px-6 py-2 bg-[#708238] text-[#0A0F0D] rounded-lg hover:bg-[#F0FFF0] transition-all"
                            >
                                Try Again
                            </button>
                        </div>
                    )}

                    {/* Events Grid */}
                    {!loading && !error && events.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {events.map((event, index) => (
                                <motion.div
                                    key={event.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                >
                                    <Link href={`/events/${event.id}`}>
                                        <div className="relative overflow-hidden rounded-xl bg-white/5 backdrop-blur-xl border border-white/10 hover:border-[#708238]/50 transition-all duration-300 group cursor-pointer h-full flex flex-col">
                                            {/* Event Image */}
                                            <div className="relative aspect-[4/3] overflow-hidden">
                                                <Image
                                                    src={event.eventPosterUrl}
                                                    alt={event.eventName}
                                                    fill
                                                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                                                {/* Featured Badge */}
                                                {event.isFeatured && (
                                                    <div className="absolute top-3 right-3 px-3 py-1 bg-[#708238] text-[#0A0F0D] text-xs font-bold rounded-full">
                                                        FEATURED
                                                    </div>
                                                )}

                                                {/* Category Badge */}
                                                <div className="absolute top-3 left-3 px-3 py-1 bg-black/50 backdrop-blur-sm text-white text-xs rounded-full">
                                                    {event.category}
                                                </div>

                                                {/* Price */}
                                                <div className="absolute bottom-3 left-3 px-3 py-1.5 bg-[#708238] text-[#0A0F0D] font-bold rounded-lg">
                                                    {event.currency} {event.price.toLocaleString()}
                                                </div>
                                            </div>

                                            {/* Event Details */}
                                            <div className="p-5 flex-1 flex flex-col">
                                                <h3 className="text-xl font-bold mb-3 group-hover:text-[#708238] transition-colors line-clamp-2">
                                                    {event.eventName}
                                                </h3>

                                                <div className="space-y-2 mb-4">
                                                    <div className="flex items-center gap-2 text-sm text-white/70">
                                                        <Calendar size={16} className="text-[#708238]" />
                                                        <span>{event.date} • {event.time}</span>
                                                    </div>

                                                    <div className="flex items-center gap-2 text-sm text-white/70">
                                                        <MapPin size={16} className="text-[#708238]" />
                                                        <span className="line-clamp-1">{event.eventLocation}</span>
                                                    </div>

                                                    <div className="flex items-center gap-2 text-sm text-white/70">
                                                        <Ticket size={16} className="text-[#708238]" />
                                                        <span>{event.tickets.length} ticket type{event.tickets.length > 1 ? 's' : ''} available</span>
                                                    </div>
                                                </div>

                                                {/* Description Preview */}
                                                <p className="text-sm text-white/60 line-clamp-2 mb-4 flex-1">
                                                    {event.eventDescription.replace(/[#*]/g, '').substring(0, 100)}...
                                                </p>

                                                {/* View Event Button */}
                                                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                                                    <span className="text-sm text-white/60">
                                                        By {event.companyName}
                                                    </span>
                                                    <button className="px-4 py-2 bg-[#708238]/20 text-[#708238] rounded-lg hover:bg-[#708238] hover:text-[#0A0F0D] transition-all font-medium text-sm group-hover:bg-[#708238] group-hover:text-[#0A0F0D]">
                                                        View Event
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    )}

                    {/* No Events State */}
                    {!loading && !error && events.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-20">
                            <Calendar className="w-12 h-12 text-white/30 mb-4" />
                            <p className="text-white/70 text-lg mb-2">No events available</p>
                            <p className="text-white/50 text-sm">Check back later for upcoming events</p>
                        </div>
                    )}
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
                            Powered by{" "}
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
    );
}

