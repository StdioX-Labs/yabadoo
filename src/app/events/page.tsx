"use client";

import { useEffect, useState, useRef } from "react";
import {
    Calendar,
    MapPin,
    Share2,
    Ticket,
    ChevronLeft,
    ArrowRight,
    Clock,
    Users,
    Star,
    X,
    Minus,
    Plus,
    Music,
    Flame,
    UtensilsCrossed,
    Wine,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

// Event data
const eventData = {
    eventName: "THE FUN CLUB",
    eventLocation: "Gatimaiyu Forest, Kiambu",
    eventStartDate: "2026-04-04T12:00:00",
    eventEndDate: "2026-04-05T14:00:00",
    eventPosterUrl: "/images/fun-club.jpeg",
    category: "Music & Nature",
    companyName: "YABA",
    eventDescription: `Join us for an unforgettable weekend retreat in the heart of nature. Experience live music, gourmet barbecue, handcrafted cocktails, scenic hiking trails, and evening bonfires under the stars.

## What to Expect

This is more than just an event - it's an experience that combines the best of music, nature, and community. Over two days, you'll enjoy world-class entertainment, delicious food, and the beauty of Gatimaiyu Forest.

## Activities

- **Live Music & DJ Sets** - Local and international artists
- **Gourmet Barbecue** - Premium grilled meats and vegetarian options
- **Craft Cocktails** - Handcrafted drinks by expert mixologists
- **Guided Hiking** - Explore scenic forest trails
- **Evening Bonfire** - Gather around the fire under the stars
- **Camping** - Full camping setup provided

Perfect for music lovers, nature enthusiasts, and anyone looking for a unique weekend getaway.`,
    features: [
        "Live Music Performances",
        "DJ Sets",
        "Gourmet Barbecue",
        "Craft Cocktails & Beverages",
        "Guided Forest Hikes",
        "Evening Bonfires",
        "Camping Equipment Provided",
        "Premium Sound System",
    ],
    tickets: [
        {
            id: "general-admission",
            ticketName: "**General Admission**",
            ticketPrice: 6500,
            description: "Full weekend access with all amenities, meals, drinks, and camping setup",
            quantityAvailable: 100,
            soldQuantity: 0,
            ticketLimitPerPerson: 10,
            ticketsToIssue: 1,
            isFree: false,
            isSoldOut: false,
            ticketStatus: "AVAILABLE",
        },
    ],
};

const schedule = [
    { day: "Day 1", time: "12:00 PM", title: "Check-in & Welcome", desc: "Arrival and setup" },
    { day: "Day 1", time: "2:00 PM", title: "Guided Forest Hike", desc: "Explore nature trails" },
    { day: "Day 1", time: "6:00 PM", title: "Barbecue Dinner", desc: "Gourmet grilling session" },
    { day: "Day 1", time: "8:00 PM", title: "Live Music & DJ", desc: "Evening entertainment" },
    { day: "Day 1", time: "10:00 PM", title: "Bonfire Stories", desc: "Gather around the fire" },
    { day: "Day 2", time: "8:00 AM", title: "Sunrise Yoga", desc: "Optional morning session" },
    { day: "Day 2", time: "10:00 AM", title: "Brunch & Cocktails", desc: "Leisurely meal" },
    { day: "Day 2", time: "2:00 PM", title: "Check-out", desc: "Departure" },
];

export default function EventsPage() {
    const [scrollY, setScrollY] = useState(0);
    const [scrollProgress, setScrollProgress] = useState(0);
    const [modalState, setModalState] = useState({ isOpen: false, step: "selection" });
    const [ticketQuantity, setTicketQuantity] = useState(1);
    const [isShareMenuOpen, setIsShareMenuOpen] = useState(false);
    const [viewportWidth, setViewportWidth] = useState(0);

    const heroRef = useRef<HTMLElement>(null);
    const detailsRef = useRef<HTMLElement>(null);
    const descriptionRef = useRef<HTMLDivElement>(null);
    const headerRef = useRef<HTMLElement>(null);
    const shareMenuRef = useRef<HTMLDivElement>(null);

    const currency = "KES";
    const ticketPrice = 6500;
    const totalPrice = ticketPrice * ticketQuantity;

    useEffect(() => {
        // Initialize viewport width on mount
        setViewportWidth(window.innerWidth);

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

        const handleResize = () => setViewportWidth(window.innerWidth);
        const handleClickOutside = (e: MouseEvent) => {
            if (shareMenuRef.current && !shareMenuRef.current.contains(e.target as Node)) {
                setIsShareMenuOpen(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        window.addEventListener("resize", handleResize);
        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            window.removeEventListener("scroll", handleScroll);
            window.removeEventListener("resize", handleResize);
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const formatDate = (date: Date) => {
        return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    };

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
    };

    const getDaysUntil = () => {
        const today = new Date();
        const eventDay = new Date(eventData.eventStartDate);
        return Math.ceil((eventDay.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    };

    const toggleShareMenu = async () => {
        const eventUrl = typeof window !== "undefined" ? window.location.href : "";
        if (navigator.share) {
            try {
                await navigator.share({
                    title: eventData.eventName,
                    text: `${eventData.eventName} - ${eventData.eventLocation}`,
                    url: eventUrl,
                });
            } catch (err) {
                if ((err as Error).name !== "AbortError") {
                    setIsShareMenuOpen(!isShareMenuOpen);
                }
            }
        } else {
            setIsShareMenuOpen(!isShareMenuOpen);
        }
    };

    const handleShare = async (platform: string) => {
        const eventUrl = typeof window !== "undefined" ? window.location.href : "";
        const eventText = `${eventData.eventName} - ${eventData.eventLocation}`;

        switch (platform) {
            case "Facebook":
                window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(eventUrl)}`, "_blank");
                break;
            case "Twitter":
                window.open(
                    `https://twitter.com/intent/tweet?url=${encodeURIComponent(eventUrl)}&text=${encodeURIComponent(eventText)}`,
                    "_blank"
                );
                break;
            case "WhatsApp":
                window.open(`https://wa.me/?text=${encodeURIComponent(eventText + " " + eventUrl)}`, "_blank");
                break;
            case "Copy Link":
                try {
                    await navigator.clipboard.writeText(eventUrl);
                    alert("Link copied to clipboard!");
                } catch (err) {
                    console.error("Failed to copy:", err);
                }
                break;
        }
        setIsShareMenuOpen(false);
    };

    const startDate = new Date(eventData.eventStartDate);
    const endDate = new Date(eventData.eventEndDate);
    const daysUntil = getDaysUntil();

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

                    <div className="relative" ref={shareMenuRef}>
                        <button
                            className="flex items-center justify-center w-11 h-11 rounded-full bg-white/10 backdrop-blur-xl text-white hover:bg-white/20 transition-all duration-300 border border-white/20 shadow-lg"
                            onClick={toggleShareMenu}
                        >
                            <Share2 size={20} strokeWidth={2.5} />
                        </button>

                        <AnimatePresence>
                            {isShareMenuOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    className="absolute right-0 mt-2 w-48 rounded-lg shadow-lg py-2 bg-[#1A2421] border border-[#708238]/30"
                                >
                                    {["Facebook", "Twitter", "WhatsApp", "Copy Link"].map((option) => (
                                        <button
                                            key={option}
                                            className="w-full text-left px-4 py-2 text-sm hover:bg-[#708238]/20 transition-colors"
                                            onClick={() => handleShare(option)}
                                        >
                                            {option}
                                        </button>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section
                id="hero"
                ref={heroRef}
                className="relative w-full overflow-hidden"
                style={{ minHeight: viewportWidth < 768 ? "100vh" : "600px", maxHeight: viewportWidth < 768 ? "none" : "700px" }}
            >
                <div className="absolute inset-0 z-0">
                    <div className="relative w-full h-full flex items-center justify-center">
                        <div className="absolute inset-0 bg-black/80">
                            <div
                                className="absolute inset-0 opacity-20"
                                style={{
                                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%239C92AC' fillOpacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                                }}
                            />
                        </div>

                        <div className={viewportWidth < 768 ? "w-full h-full" : "h-full max-h-[400px] aspect-square mx-auto"}>
                            <div className={`${viewportWidth < 768 ? "absolute inset-0" : "relative h-full w-full rounded-lg"}`}>
                                <div
                                    className="absolute -inset-4 bg-gradient-to-r from-[#708238] to-[#F0FFF0] opacity-20 blur-2xl"
                                    style={{ animation: "pulse 3s ease-in-out infinite alternate" }}
                                />
                                {viewportWidth < 768 ? (
                                    <div className="absolute inset-0 w-full h-full">
                                        <Image
                                            src={eventData.eventPosterUrl}
                                            alt={eventData.eventName}
                                            fill
                                            className="object-cover"
                                            priority
                                        />
                                        <div
                                            className="absolute inset-0"
                                            style={{
                                                background:
                                                    "linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.7) 100%)",
                                                opacity: 0.9,
                                            }}
                                        />
                                    </div>
                                ) : (
                                    <Image
                                        src={eventData.eventPosterUrl}
                                        alt={eventData.eventName}
                                        width={400}
                                        height={400}
                                        className="object-contain rounded-lg"
                                        priority
                                    />
                                )}
                            </div>
                        </div>

                        {viewportWidth >= 768 && (
                            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-[#0A0F0D]" />
                        )}
                    </div>
                </div>

                <div className={`relative z-10 container mx-auto h-full flex flex-col justify-end px-4 pb-12 ${viewportWidth < 768 ? "pt-92" : "pt-60"}`}>
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="max-w-3xl"
                    >
                        <div className="mb-4">
                            <span className="inline-block px-4 py-1.5 text-xs uppercase tracking-widest rounded-full backdrop-blur-sm bg-black/30 text-white border border-white/30">
                                {eventData.category}
                            </span>
                        </div>

                        <h1
                            className="text-4xl md:text-6xl font-bold mb-4 leading-[1.1] tracking-tight text-white"
                            style={{ textShadow: "0 2px 4px rgba(0,0,0,0.8)" }}
                        >
                            {eventData.eventName.split(" ").map((word, i) => (
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

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-6">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                                className="flex items-center gap-2 bg-black/30 backdrop-blur-sm px-3 py-1.5 rounded-full"
                            >
                                <Calendar size={14} className="text-white" />
                                <span className="text-sm text-white">{formatDate(startDate)}</span>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5, delay: 0.3 }}
                                className="flex items-center gap-2 bg-black/30 backdrop-blur-sm px-3 py-1.5 rounded-full"
                            >
                                <MapPin size={14} className="text-white" />
                                <span className="text-sm text-white">{eventData.eventLocation}</span>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5, delay: 0.4 }}
                                className="flex items-center gap-2 bg-black/30 backdrop-blur-sm px-3 py-1.5 rounded-full"
                            >
                                <Users size={14} className="text-white" />
                                <span className="text-sm text-white">By {eventData.companyName}</span>
                            </motion.div>
                        </div>

                        <div className="flex flex-wrap gap-4">
                            <motion.button
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5, delay: 0.5 }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setModalState({ isOpen: true, step: "selection" })}
                                className="px-6 py-2.5 rounded-full bg-[#708238] text-[#0A0F0D] font-medium hover:bg-[#F0FFF0] transition-all duration-300 flex items-center gap-2 shadow-lg shadow-[#708238]/50"
                            >
                                <Ticket size={16} />
                                <span>Get Tickets</span>
                            </motion.button>

                            {daysUntil > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.5, delay: 0.6 }}
                                    className="flex items-center px-4 py-2.5 rounded-full bg-black/30 border-white/20 backdrop-blur-sm border"
                                >
                                    <span className="text-white text-sm font-medium">
                                        {daysUntil} {daysUntil === 1 ? "day" : "days"} until event
                                    </span>
                                </motion.div>
                            )}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Event Details Section */}
            <section id="details" ref={detailsRef} className="relative py-12 bg-[#0A0F0D]">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12 max-w-4xl mx-auto">
                        {/* Date Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="relative overflow-hidden rounded-xl p-4 group hover:scale-[1.02] transition-all duration-300 bg-white/5 backdrop-blur-xl border border-white/5"
                        >
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-[#708238]/20" />
                            <div className="relative z-10">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-9 h-9 rounded-full flex items-center justify-center bg-[#708238]/30 border border-[#708238]/40">
                                        <Calendar size={16} className="text-white" />
                                    </div>
                                    <span className="text-xs uppercase tracking-wider font-medium">Date & Time</span>
                                </div>
                                <div className="space-y-1.5">
                                    <div className="text-lg font-bold tracking-tight">{formatDate(startDate)} - {formatDate(endDate)}</div>
                                    <div className="flex items-center gap-2 text-white/80">
                                        <Clock size={12} />
                                        <span className="text-sm">{formatTime(startDate)} - {formatTime(endDate)}</span>
                                    </div>
                                    {daysUntil > 0 && (
                                        <div className="mt-2 inline-block px-2.5 py-1 text-xs rounded-full bg-[#708238]/20 text-[#708238] border border-[#708238]/40">
                                            {daysUntil} {daysUntil === 1 ? "day" : "days"} until event
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>

                        {/* Location Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="relative overflow-hidden rounded-xl p-4 group hover:scale-[1.02] transition-all duration-300 bg-white/5 backdrop-blur-xl border border-white/5"
                        >
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-[#708238]/20" />
                            <div className="relative z-10">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-9 h-9 rounded-full flex items-center justify-center bg-[#708238]/30 border border-[#708238]/40">
                                        <MapPin size={16} className="text-white" />
                                    </div>
                                    <span className="text-xs uppercase tracking-wider font-medium">Location</span>
                                </div>
                                <div className="space-y-1.5">
                                    <div className="text-lg font-bold tracking-tight">Gatimaiyu Forest</div>
                                    <div className="text-sm text-white/80">Kiambu County, Kenya</div>
                                    <div className="mt-2 text-xs text-white/60 flex items-center gap-1 cursor-pointer hover:text-white transition-colors">
                                        <span>View on map</span>
                                        <ArrowRight size={12} />
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Tickets Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            className="relative overflow-hidden rounded-xl p-4 group hover:scale-[1.02] transition-all duration-300 bg-white/5 backdrop-blur-xl border border-white/5"
                        >
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-[#708238]/20" />
                            <div className="relative z-10">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-9 h-9 rounded-full flex items-center justify-center bg-[#708238]/30 border border-[#708238]/40">
                                        <Ticket size={16} className="text-white" />
                                    </div>
                                    <span className="text-xs uppercase tracking-wider font-medium">Tickets</span>
                                </div>
                                <div className="space-y-1.5">
                                    <div className="text-lg font-bold tracking-tight">
                                        From {currency} {ticketPrice.toLocaleString()}
                                    </div>
                                    <div className="text-sm text-white/80">Limited availability</div>
                                    <button
                                        className="mt-2 text-xs font-medium flex items-center gap-1 text-[#708238] hover:text-[#F0FFF0] transition-colors"
                                        onClick={() => setModalState({ isOpen: true, step: "selection" })}
                                    >
                                        <span>View ticket options</span>
                                        <ArrowRight size={12} />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Description */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="max-w-3xl mx-auto mb-12"
                        ref={descriptionRef}
                    >
                        <h2 className="text-xl font-bold mb-5 tracking-tight inline-flex items-center">
                            <div className="w-1 h-6 bg-gradient-to-b from-[#708238] to-[#F0FFF0] rounded-full mr-3" />
                            About this event
                        </h2>
                        <div className="prose prose-invert max-w-none">
                            {eventData.eventDescription.split("\n\n").map((paragraph, i) => (
                                <p key={i} className="mb-4 text-white/80 leading-relaxed">
                                    {paragraph}
                                </p>
                            ))}
                        </div>
                    </motion.div>

                    {/* Features */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="max-w-3xl mx-auto mb-12"
                    >
                        <h3 className="text-xl font-bold mb-4 tracking-tight inline-flex items-center">
                            <div className="w-1 h-6 bg-gradient-to-b from-[#708238] to-[#F0FFF0] rounded-full mr-3" />
                            <Star size={16} className="text-[#708238] mr-2" />
                            Event Features
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {eventData.features.map((feature, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 10 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.3, delay: index * 0.1 }}
                                    className="flex items-center gap-3 p-3 rounded-lg group hover:bg-white/5 transition-colors bg-white/3 border border-white/5"
                                >
                                    <div className="w-6 h-6 rounded-full flex items-center justify-center bg-[#708238]/30 group-hover:scale-110 transition-transform">
                                        <Star size={10} className="text-[#708238]" />
                                    </div>
                                    <span className="text-xs md:text-sm">{feature}</span>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* What's Included */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="max-w-3xl mx-auto"
                    >
                        <h3 className="text-xl font-bold mb-6 tracking-tight inline-flex items-center">
                            <div className="w-1 h-6 bg-gradient-to-b from-[#708238] to-[#F0FFF0] rounded-full mr-3" />
                            What's Included
                        </h3>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[
                                { icon: UtensilsCrossed, title: "Gourmet Barbecue", desc: "Premium grilled meats & vegetarian options" },
                                { icon: Wine, title: "Craft Cocktails", desc: "Handcrafted drinks & premium beverages" },
                                { icon: Music, title: "Live Music", desc: "Local artists & DJ performances" },
                                { icon: Users, title: "Guided Hiking", desc: "Scenic forest trails with guides" },
                                { icon: Flame, title: "Evening Bonfire", desc: "Starlit campfire experience" },
                                { icon: Star, title: "Camping Setup", desc: "Tents & camping equipment provided" },
                            ].map((item, index) => {
                                const Icon = item.icon;
                                return (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 10 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.3, delay: index * 0.1 }}
                                        className="flex gap-4 p-4 bg-white/3 border border-white/5 rounded-lg hover:border-[#708238]/50 transition-all duration-300 group"
                                    >
                                        <div className="text-[#708238] group-hover:scale-110 transition-transform">
                                            <Icon size={24} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold mb-1 group-hover:text-[#708238] transition-colors">{item.title}</h4>
                                            <p className="text-xs text-white/60">{item.desc}</p>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Ticket Modal */}
            {modalState.isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="relative w-full max-w-2xl bg-[#0D1311] border-2 border-[#708238] rounded-lg shadow-2xl my-8"
                    >
                        <button
                            onClick={() => setModalState({ isOpen: false, step: "selection" })}
                            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-[#708238] transition-all z-10"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="relative aspect-[16/9] overflow-hidden">
                            <Image src={eventData.eventPosterUrl} alt={eventData.eventName} fill className="object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                            <div className="absolute bottom-0 left-0 right-0 p-6">
                                <h2 className="text-white text-2xl font-bold mb-2">{eventData.eventName}</h2>
                                <div className="flex flex-wrap gap-3">
                                    <div className="flex items-center bg-black/30 backdrop-blur-sm px-3 py-1.5 rounded-full">
                                        <Calendar className="w-4 h-4 mr-2 text-white/70" />
                                        <span className="text-sm text-white/90">{formatDate(startDate)}</span>
                                    </div>
                                    <div className="flex items-center bg-black/30 backdrop-blur-sm px-3 py-1.5 rounded-full">
                                        <MapPin className="w-4 h-4 mr-2 text-white/70" />
                                        <span className="text-sm text-white/90">{eventData.eventLocation}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-6">
                            <h3 className="text-xl font-bold mb-6">SELECT TICKETS</h3>

                            <div className="mb-6 p-6 border border-[#708238]/30 rounded-lg hover:border-[#708238] transition-all">
                                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                                    <div className="flex-1">
                                        <h4 className="font-bold text-lg mb-2">General Admission</h4>
                                        <p className="text-sm text-white/70 mb-3">
                                            Full weekend access with all amenities, meals, drinks, and camping setup
                                        </p>
                                        <div className="flex items-baseline gap-2">
                                            <p className="text-2xl font-bold text-[#708238]">{currency} {ticketPrice.toLocaleString()}</p>
                                            <span className="text-sm text-white/60">per person</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center">
                                        <button
                                            onClick={() => setTicketQuantity(Math.max(1, ticketQuantity - 1))}
                                            className="w-10 h-10 flex items-center justify-center border border-[#708238]/30 hover:bg-[#708238]/20 rounded-l-lg transition-all"
                                        >
                                            <Minus className="w-4 h-4" />
                                        </button>
                                        <div className="w-12 h-10 flex items-center justify-center border-t border-b border-[#708238]/30 font-bold">
                                            {ticketQuantity}
                                        </div>
                                        <button
                                            onClick={() => setTicketQuantity(Math.min(10, ticketQuantity + 1))}
                                            className="w-10 h-10 flex items-center justify-center border border-[#708238]/30 hover:bg-[#708238]/20 rounded-r-lg transition-all"
                                        >
                                            <Plus className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="border-t border-[#708238]/30 pt-6 mb-6">
                                <div className="flex justify-between mb-2">
                                    <span className="font-medium">Tickets</span>
                                    <span className="font-medium">{ticketQuantity}</span>
                                </div>
                                <div className="flex justify-between font-bold text-xl">
                                    <span>TOTAL</span>
                                    <span className="text-[#708238]">{currency} {totalPrice.toLocaleString()}</span>
                                </div>
                            </div>

                            <div className="flex justify-end gap-4">
                                <button
                                    onClick={() => setModalState({ isOpen: false, step: "selection" })}
                                    className="px-6 py-3 rounded-lg border border-[#708238]/30 hover:bg-[#708238]/10 transition-colors"
                                >
                                    Cancel
                                </button>
                                <Link
                                    href={`/events/checkout?quantity=${ticketQuantity}`}
                                    className="px-8 py-3 bg-[#708238] text-[#0A0F0D] font-bold rounded-lg hover:bg-[#F0FFF0] transition-all shadow-lg shadow-[#708238]/50"
                                >
                                    CONTINUE
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}

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

            <style jsx global>{`
        @keyframes scrollIndicator {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(16px); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 0.5; transform: scale(0.95); }
          50% { opacity: 0.8; transform: scale(1.05); }
        }
      `}</style>
        </div>
    );
}
