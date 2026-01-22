'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Play, Pause, ShoppingCart, Star, Music, ChevronLeft, Shirt, Package, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Track {
    number: number;
    title: string;
    file: string;
    duration: string;
    featured: boolean;
}

const EP_PRICE = 1000;

const tracks: Track[] = [
    { number: 1, title: "Adhiambo", file: "/music/v1 Yaba - Adhiambo.wav", duration: "3:42", featured: false },
    { number: 2, title: "Mazoea", file: "/music/v1 Yaba - Mazoea 2.wav", duration: "4:15", featured: false },
    { number: 3, title: "Sema", file: "/music/v1 Yaba - Sema 2.wav", duration: "3:28", featured: false },
    { number: 4, title: "Something Sweet", file: "/music/v1 Yaba - Something Sweet 2.wav", duration: "4:01", featured: true },
    { number: 5, title: "Today", file: "/music/v1 Yaba - Today.wav", duration: "3:55", featured: false },
    { number: 6, title: "Wape Wape", file: "/music/v1 Yaba - Wape Wape.wav", duration: "3:38", featured: true },
];

interface Product {
    id: number;
    name: string;
    price: number;
    category: string;
    description: string;
    available: boolean;
    type: 'music' | 'merch';
    tracks?: Track[];
}

const products: Product[] = [
    {
        id: 0,
        name: 'WAPE WAPE EP',
        price: 1000,
        category: 'Digital Music',
        description: 'Complete 6-track digital album. Instant download after purchase.',
        available: true,
        type: 'music',
        tracks: tracks,
    },
    {
        id: 1,
        name: 'YABA Official T-Shirt',
        price: 1500,
        category: 'Apparel',
        description: 'Premium cotton t-shirt with YABA logo',
        available: false,
        type: 'merch',
    },
    {
        id: 2,
        name: 'Rhumbacane Hoodie',
        price: 3000,
        category: 'Apparel',
        description: 'Comfortable hoodie with embroidered logo',
        available: false,
        type: 'merch',
    },
    {
        id: 3,
        name: 'WAPE WAPE Poster',
        price: 500,
        category: 'Collectibles',
        description: 'Limited edition album artwork poster',
        available: false,
        type: 'merch',
    },
];

export default function ShopPage() {
    const router = useRouter();
    const [currentTrack, setCurrentTrack] = useState<number | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [showTrackModal, setShowTrackModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const PREVIEW_DURATION = 30;

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.addEventListener('timeupdate', handleTimeUpdate);
            audioRef.current.addEventListener('ended', handleTrackEnd);

            return () => {
                audioRef.current?.removeEventListener('timeupdate', handleTimeUpdate);
                audioRef.current?.removeEventListener('ended', handleTrackEnd);
            };
        }
    }, [currentTrack]);

    const handleTimeUpdate = () => {
        if (audioRef.current) {
            const time = audioRef.current.currentTime;
            setCurrentTime(time);

            if (time >= PREVIEW_DURATION) {
                audioRef.current.pause();
                setIsPlaying(false);
            }
        }
    };

    const handleTrackEnd = () => {
        setIsPlaying(false);
        setCurrentTime(0);
    };

    const playTrack = (trackNumber: number) => {
        const track = tracks.find(t => t.number === trackNumber);
        if (!track) return;

        if (currentTrack === trackNumber && isPlaying) {
            audioRef.current?.pause();
            setIsPlaying(false);
        } else {
            if (currentTrack !== trackNumber) {
                setCurrentTrack(trackNumber);
                setCurrentTime(0);

                if (audioRef.current) {
                    audioRef.current.src = track.file;
                    audioRef.current.load();
                }
            }

            audioRef.current?.play();
            setIsPlaying(true);
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <>
            <audio ref={audioRef} />

            <div className="min-h-screen bg-[#0A0F0D]">
                {/* Header */}
                <header className="sticky top-0 left-0 right-0 z-40 bg-[#0A0F0D]/95 backdrop-blur-xl border-b border-[#708238]/20">
                    <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                        <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                            <ChevronLeft className="w-5 h-5 text-[#708238]" />
                            <span className="text-[#F0FFF0] text-sm">Back to Home</span>
                        </Link>
                        <div className="flex items-center gap-3">
                            <Image src="/images/logo/yaba_logo.png" alt="YABA" width={40} height={40} className="rounded-full" />
                            <span className="text-[#F0FFF0] font-bold">YABA</span>
                        </div>
                    </div>
                </header>

                {/* Hero Section */}
                <section className="relative py-12 px-4 bg-gradient-to-b from-[#708238]/10 to-transparent">
                    <div className="container mx-auto max-w-6xl text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <h1 className="text-5xl md:text-6xl font-bold mb-4 text-[#F0FFF0]">YABA SHOP</h1>
                            <p className="text-xl text-[#708238] mb-2">Official Music & Merchandise</p>
                            <p className="text-[#F0FFF0]/60 max-w-2xl mx-auto">
                                Get the latest music, exclusive merch, and support the Prince of Rhumbacane
                            </p>
                        </motion.div>
                    </div>
                </section>

                {/* Products Grid */}
                <section className="py-16 px-4">
                    <div className="container mx-auto max-w-6xl">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {products.map((product, index) => (
                                <motion.div
                                    key={product.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, delay: index * 0.1 }}
                                    className="relative group"
                                >
                                    <div className="bg-[#0D1311] rounded-2xl border border-[#708238]/20 hover:border-[#708238]/50 transition-all overflow-hidden h-full flex flex-col">
                                        {/* Product Image */}
                                        <div className="relative aspect-square bg-gradient-to-br from-[#708238]/20 to-[#0A0F0D]/50">
                                            {product.type === 'music' ? (
                                                <>
                                                    <Image
                                                        src="/images/wape.PNG"
                                                        alt="WAPE WAPE EP"
                                                        fill
                                                        className="object-cover"
                                                    />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                                                </>
                                            ) : (
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    {product.category === 'Apparel' ? (
                                                        <Shirt className="w-24 h-24 text-[#708238]/40" />
                                                    ) : (
                                                        <Package className="w-24 h-24 text-[#708238]/40" />
                                                    )}
                                                </div>
                                            )}
                                            {!product.available && (
                                                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                                    <span className="px-4 py-2 bg-[#708238]/90 text-[#0A0F0D] font-bold rounded-lg text-sm">
                                                        COMING SOON
                                                    </span>
                                                </div>
                                            )}
                                            {product.type === 'music' && product.available && (
                                                <button
                                                    onClick={() => {
                                                        setSelectedProduct(product);
                                                        setShowTrackModal(true);
                                                    }}
                                                    className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-[#708238]/90 hover:bg-[#708238] text-[#0A0F0D] font-bold rounded-lg text-sm flex items-center gap-2 transition-all"
                                                >
                                                    <Play className="w-4 h-4" />
                                                    Preview Tracks
                                                </button>
                                            )}
                                        </div>

                                        {/* Product Info */}
                                        <div className="p-5 flex-1 flex flex-col">
                                            <div className="mb-4 flex-1">
                                                <span className="text-xs text-[#708238] font-semibold uppercase">{product.category}</span>
                                                <h3 className="text-lg font-bold text-[#F0FFF0] mt-1">{product.name}</h3>
                                                <p className="text-sm text-[#F0FFF0]/60 mt-2">{product.description}</p>
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <span className="text-2xl font-bold text-[#708238]">
                                                    KES {product.price.toLocaleString()}
                                                </span>
                                                <button
                                                    onClick={() => product.available && router.push('/shop/checkout')}
                                                    disabled={!product.available}
                                                    className={`px-5 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${product.available
                                                        ? 'bg-[#708238] text-[#0A0F0D] hover:bg-[#F0FFF0] shadow-lg shadow-[#708238]/30'
                                                        : 'bg-[#708238]/20 text-[#F0FFF0]/40 cursor-not-allowed'
                                                        }`}
                                                >
                                                    <ShoppingCart className="w-4 h-4" />
                                                    {product.available ? 'Buy Now' : 'Unavailable'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        <div className="mt-12 text-center">
                            <p className="text-[#F0FFF0]/60 text-sm">
                                More items coming soon! Follow us on social media for updates.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="py-8 text-center text-[#F0FFF0]/50 text-sm border-t border-[#708238]/20">
                    <p>© 2026 YABA. All rights reserved.</p>
                    <p className="mt-2">
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
                </footer>
            </div>

            {/* Track Preview Modal */}
            <AnimatePresence>
                {showTrackModal && selectedProduct && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
                        onClick={() => setShowTrackModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-[#0D1311] border border-[#708238] rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-2xl font-bold text-[#F0FFF0]">{selectedProduct.name} - Preview</h3>
                                <button
                                    onClick={() => setShowTrackModal(false)}
                                    className="p-2 hover:bg-[#708238]/10 rounded-lg transition-colors"
                                >
                                    <X className="w-5 h-5 text-[#F0FFF0]" />
                                </button>
                            </div>

                            <div className="space-y-3 mb-6">
                                {selectedProduct.tracks?.map((track) => {
                                    const isCurrentTrack = currentTrack === track.number;
                                    const isCurrentlyPlaying = isCurrentTrack && isPlaying;

                                    return (
                                        <div
                                            key={track.number}
                                            className={`relative bg-[#0A0F0D] rounded-xl border transition-all ${isCurrentTrack
                                                ? 'border-[#708238] shadow-lg shadow-[#708238]/20'
                                                : 'border-[#708238]/20 hover:border-[#708238]/50'
                                                }`}
                                        >
                                            <div className="p-4">
                                                <div className="flex items-center gap-4">
                                                    <button
                                                        onClick={() => playTrack(track.number)}
                                                        className={`w-10 h-10 rounded-lg bg-gradient-to-br flex items-center justify-center transition-all flex-shrink-0 ${isCurrentlyPlaying
                                                            ? 'from-[#708238] to-[#3F704D] scale-105'
                                                            : 'from-[#708238]/30 to-[#3F704D]/30 hover:from-[#708238] hover:to-[#3F704D]'
                                                            }`}
                                                    >
                                                        {isCurrentlyPlaying ? (
                                                            <Pause className="w-4 h-4 text-[#F0FFF0]" />
                                                        ) : (
                                                            <Play className="w-4 h-4 text-[#F0FFF0] ml-0.5" />
                                                        )}
                                                    </button>

                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center justify-between gap-4">
                                                            <div className="flex items-center gap-2 min-w-0 flex-1">
                                                                <span className={`text-xs font-bold ${isCurrentTrack ? 'text-[#708238]' : 'text-[#F0FFF0]/40'
                                                                    }`}>
                                                                    {String(track.number).padStart(2, '0')}
                                                                </span>
                                                                <div className="min-w-0 flex-1">
                                                                    <h4 className={`text-sm font-semibold truncate ${isCurrentTrack ? 'text-[#708238]' : 'text-[#F0FFF0]'
                                                                        }`}>
                                                                        {track.title}
                                                                    </h4>
                                                                    {track.featured && (
                                                                        <div className="flex items-center gap-1 mt-0.5">
                                                                            <Star className="w-2.5 h-2.5 text-[#708238] fill-[#708238]" />
                                                                            <span className="text-xs text-[#708238] font-semibold">FEATURED</span>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <span className="text-xs text-[#F0FFF0]/60 flex-shrink-0">{track.duration}</span>
                                                        </div>

                                                        {isCurrentTrack && (
                                                            <div className="mt-2">
                                                                <div className="flex items-center justify-between text-xs text-[#F0FFF0]/60 mb-1.5">
                                                                    <span>{formatTime(currentTime)}</span>
                                                                    <span className="text-[#708238]">Preview • {formatTime(PREVIEW_DURATION)}</span>
                                                                </div>
                                                                <div className="relative w-full h-1.5 bg-[#0D1311] rounded-full overflow-hidden">
                                                                    <div
                                                                        className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#708238] to-[#3F704D] transition-all"
                                                                        style={{ width: `${(currentTime / PREVIEW_DURATION) * 100}%` }}
                                                                    />
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            <button
                                onClick={() => router.push('/shop/checkout')}
                                className="w-full px-6 py-4 bg-[#708238] text-[#0A0F0D] font-bold rounded-lg hover:bg-[#F0FFF0] transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#708238]/50"
                            >
                                <ShoppingCart className="w-5 h-5" />
                                PURCHASE FOR KES {EP_PRICE.toLocaleString()}
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
